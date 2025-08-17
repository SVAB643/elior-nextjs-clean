// src/app/api/analyze-realtime/route.js
import OpenAI from 'openai';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Utilitaires pour la normalisation des questions
const FRENCH_QUOTES_REGEX = /["'«»""„‟‚'']/g;
const WHITESPACE_REGEX = /\s+/g;
const INTERROGATIVES = [
  'Comment', 'Quel', 'Quelle', 'Quels', 'Quelles', 
  'Où', 'Quand', 'Qui', 'Pourquoi', 'Que', 'Qu\'est-ce'
];

function json(data, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

function wordCount(str) {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

function ensureInterrogativeStart(q) {
  const startsOk = INTERROGATIVES.some((w) => 
    q.toLowerCase().startsWith(w.toLowerCase() + ' ')
  );
  return startsOk ? q : `Comment ${q.toLowerCase()}`;
}

function normalizeQuestion(raw) {
  let q = (raw || '').trim();
  
  // Supprimer guillemets typographiques
  q = q.replace(FRENCH_QUOTES_REGEX, '');
  
  // Normaliser espaces
  q = q.replace(WHITESPACE_REGEX, ' ');
  
  // Majuscule initiale
  if (q.length > 0) q = q.charAt(0).toUpperCase() + q.slice(1);
  
  // Forcer début interrogatif
  q = ensureInterrogativeStart(q);
  
  // Limiter à 8-12 mots
  let wc = wordCount(q);
  if (wc > 12) {
    const words = q.split(' ').slice(0, 12);
    q = words.join(' ');
  }
  
  // Point d'interrogation final unique
  q = q.replace(/[?？！]+$/u, '');
  q = `${q} ?`;
  
  return q;
}

// Fallbacks spécialisés pour les histoires de vie
const BIOGRAPHICAL_FALLBACKS = [
  {
    specificElement: 'cette période de votre vie',
    followUpQuestion: 'Quel souvenir vous marque le plus de cette époque',
    confidence: 0.75,
  },
  {
    specificElement: 'cette personne importante',
    followUpQuestion: 'Comment cette personne vous parlait-elle habituellement',
    confidence: 0.75,
  },
  {
    specificElement: 'ce lieu significatif',
    followUpQuestion: 'Quelle odeur ou quel son caractérisait cet endroit',
    confidence: 0.75,
  },
  {
    specificElement: 'cette émotion ressentie',
    followUpQuestion: 'Dans quelles circonstances ressentiez-vous cela le plus fort',
    confidence: 0.75,
  },
  {
    specificElement: 'cette habitude ou tradition',
    followUpQuestion: 'Qui vous a transmis cette habitude en premier',
    confidence: 0.75,
  },
];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const transcript = isNonEmptyString(body.transcript) ? body.transcript.trim() : '';
    const currentQuestion = isNonEmptyString(body.currentQuestion) ? body.currentQuestion.trim() : '';

    // Validation de base
    if (!transcript || transcript.length < 30) {
      return json({ hasInterestingPoint: false });
    }

    // Prompt optimisé pour les histoires de vie
    const prompt = `Tu es un interviewer expert spécialisé dans la collecte d'histoires de vie personnelles et familiales. 

Ton rôle : analyser cette réponse biographique et identifier UN élément très spécifique qui mérite d'être approfondi pour enrichir le récit de vie.

QUESTION POSÉE : "${currentQuestion}"

RÉPONSE OBTENUE : "${transcript}"

CRITÈRES DE SÉLECTION (par ordre de priorité) :
1. PERSONNES mentionnées (famille, amis, collègues, voisins...)
2. LIEUX significatifs (maisons, quartiers, écoles, lieux de travail...)
3. ÉMOTIONS fortes (joie, tristesse, peur, fierté, colère...)
4. ÉVÉNEMENTS marquants (premières fois, changements, cérémonies...)
5. OBJETS ou HABITUDES avec valeur sentimentale
6. DÉTAILS SENSORIELS (odeurs, sons, goûts, textures, couleurs...)

EXEMPLES DE BONNES QUESTIONS DE SUIVI :

Si mention "ma grand-mère" → "Comment était physiquement votre grand-mère ?"
Si mention "notre maison" → "Quelle pièce préfériez-vous dans cette maison ?"
Si mention "j'étais triste" → "Qui vous consolait quand vous étiez triste ?"
Si mention "mon premier jour d'école" → "Que portez-vous ce premier jour d'école ?"
Si mention "dimanche en famille" → "Qui s'occupait de préparer le repas du dimanche ?"
Si mention "mon père travaillait" → "À quelle heure votre père rentrait-il le soir ?"

RÈGLES STRICTES :
- Question de 6-10 mots maximum
- Très concrète et spécifique (pas générique)
- Faire revivre un détail précis, sensoriel, émotionnel
- Commencer par un mot interrogatif français
- Éviter "Pouvez-vous développer" ou formules vagues
- Privilégier les détails qui enrichissent le récit familial

Format de réponse JSON obligatoire :
{
  "hasInterestingPoint": true/false,
  "specificElement": "l'élément exact détecté dans la réponse",
  "followUpQuestion": "Question courte et précise ?",
  "confidence": 0.8
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Tu es un expert en collecte d\'histoires de vie qui pose des questions précises pour faire revivre les souvenirs en détail. Tu réponds TOUJOURS en JSON valide.'
        },
        { role: 'user', content: prompt }
      ],
      max_tokens: 200,
      temperature: 0.4,
      response_format: { type: 'json_object' },
    });

    // Parsing de la réponse
    let parsed = null;
    try {
      const raw = completion?.choices?.[0]?.message?.content ?? '{}';
      parsed = JSON.parse(raw);
    } catch (e) {
      console.warn('Erreur parsing JSON OpenAI:', e);
      const fb = pickRandom(BIOGRAPHICAL_FALLBACKS);
      return json({
        hasInterestingPoint: true,
        specificElement: fb.specificElement,
        followUpQuestion: normalizeQuestion(fb.followUpQuestion),
        confidence: fb.confidence,
      });
    }

    // Validation du contenu
    const hasInterestingPoint = parsed?.hasInterestingPoint === true;
    const specificElement = isNonEmptyString(parsed?.specificElement) 
      ? parsed.specificElement.trim() 
      : '';
    const followUpQuestionRaw = isNonEmptyString(parsed?.followUpQuestion) 
      ? parsed.followUpQuestion.trim() 
      : '';
    const confidence = typeof parsed?.confidence === 'number' 
      ? Math.min(0.95, Math.max(0.6, parsed.confidence))
      : 0.8;

    // Vérification qualité de la réponse
    if (!hasInterestingPoint || !specificElement || !followUpQuestionRaw) {
      const fb = pickRandom(BIOGRAPHICAL_FALLBACKS);
      return json({
        hasInterestingPoint: true,
        specificElement: fb.specificElement,
        followUpQuestion: normalizeQuestion(fb.followUpQuestion),
        confidence: 0.7,
      });
    }

    // Validation longueur question (éviter les questions trop longues)
    const wordCountCheck = wordCount(followUpQuestionRaw);
    if (wordCountCheck > 15) {
      const fb = pickRandom(BIOGRAPHICAL_FALLBACKS);
      return json({
        hasInterestingPoint: true,
        specificElement: fb.specificElement,
        followUpQuestion: normalizeQuestion(fb.followUpQuestion),
        confidence: 0.7,
      });
    }

    // Nettoyage final
    const cleanQuestion = normalizeQuestion(followUpQuestionRaw);

    return json({
      hasInterestingPoint: true,
      specificElement,
      followUpQuestion: cleanQuestion,
      confidence,
    });

  } catch (err) {
    console.error('Erreur API analyze-realtime:', err);
    
    // Fallback final robuste
    const fb = pickRandom(BIOGRAPHICAL_FALLBACKS);
    return json({
      hasInterestingPoint: true,
      specificElement: fb.specificElement,
      followUpQuestion: normalizeQuestion(fb.followUpQuestion),
      confidence: 0.65,
    });
  }
}