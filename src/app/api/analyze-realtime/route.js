import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { transcript, currentQuestion } = await req.json();
    
    // Ne pas analyser si le transcript est trop court
    if (!transcript || transcript.length < 50) {
      return Response.json({ hasInterestingPoint: false });
    }
    
    const prompt = `Analyse cette transcription partielle d'une réponse biographique en temps réel.

MISSION : Détecter s'il y a un point précis qui mériterait d'être approfondi MAINTENANT.

Question originale : "${currentQuestion}"
Transcription en cours : "${transcript}"

RÈGLES STRICTES :
- Ne réagis QUE si tu détectes quelque chose de vraiment intéressant et émotionnel
- La question de suivi doit être précise et courte (max 8 mots)
- Cible : émotions fortes, personnes mentionnées, lieux spéciaux, événements marquants
- Sois très sélectif : ne propose pas de question pour tout
- Focus sur ce qui peut enrichir émotionnellement le récit

EXEMPLES de déclencheurs :
- Mention d'une personne : "ma grand-mère Marie" → "Comment était Marie ?"
- Lieu émotionnel : "notre petite maison" → "Décrivez cette maison"
- Événement : "ce jour terrible" → "Que s'est-il passé ?"
- Émotion forte : "j'étais si heureux" → "Pourquoi tant de bonheur ?"

Réponds en JSON :
{
  "hasInterestingPoint": true/false,
  "interestingPoint": "ce qui a déclenché l'intérêt",
  "followUpQuestion": "question courte et précise",
  "confidence": 0.8,
  "timing": "immediate"
}

Si rien d'intéressant : {"hasInterestingPoint": false}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Tu es un biographe expert qui détecte les moments émotionnels forts en temps réel pour enrichir les témoignages."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.3,
    });

    const result = JSON.parse(completion.choices[0].message.content);
    
    return Response.json(result);

  } catch (error) {
    console.error('Erreur analyse temps réel:', error);
    return Response.json({ hasInterestingPoint: false });
  }
}