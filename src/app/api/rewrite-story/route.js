// src/app/api/rewriter/route.js (ou le chemin où est ta route actuelle)

import { NextResponse } from 'next/server';

// ✅ IMPORTANT : forcer le runtime Node.js (pas Edge)
export const runtime = 'nodejs';

// ✅ init lazy (pas d'OpenAI au top-level)
let openaiClient = null;
async function getOpenAI() {
  if (!openaiClient) {
    const { default: OpenAI } = await import('openai'); // import dynamique
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY manquante');
    }
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

export async function POST(req) {
  try {
    const { chapters } = await req.json();

    if (!Array.isArray(chapters) || chapters.length === 0) {
      return NextResponse.json({ error: 'Aucun chapitre fourni' }, { status: 400 });
    }

    console.log('Début de la réécriture par chapitre…');

    const openai = await getOpenAI(); // ✅ création ici (au moment de la requête)

    const rewrittenChapters = await Promise.all(
      chapters.map(async (chapter, index) => {
        try {
          if (!chapter?.segments?.length) {
            return null;
          }

          // Regrouper par question
          const segmentsByQuestion = chapter.segments.reduce((acc, segment) => {
            const qid = segment.questionId;
            if (!acc[qid]) acc[qid] = [];
            acc[qid].push(segment);
            return acc;
          }, {});

          const answeredQuestions = (chapter.questions || []).filter(
            (q) => segmentsByQuestion[q.id]
          );

          const chapterContent = answeredQuestions
            .map((q) => `Question: ${q.text}\nRéponse: ${segmentsByQuestion[q.id].map(s => s.text).join(' ')}`)
            .join('\n\n');

          const prompt = `Tu es un biographe professionnel. Je vais te donner des témoignages audio transcrits d'une personne qui raconte sa vie.

**TON TRAVAIL :**
Transformer ces témoignages en récit biographique à la première personne, en gardant l'authenticité et l'émotion originale.

**STYLE REQUIS :**
- Première personne uniquement ("Je", "J'ai", "J'étais")
- Ton direct et authentique, comme si la personne racontait elle-même
- Respecte l'intensité émotionnelle des moments (joie, tristesse, fierté, regret)
- Phrases naturelles, pas trop littéraires
- Garde le rythme et la spontanéité du témoignage oral

**RÈGLES STRICTES :**
- Ne supprime AUCUN détail ou anecdote
- Ne rajoute RIEN qui n'est pas dans le témoignage
- Transforme juste l'oral en écrit fluide
- Respecte l'émotion de chaque moment (ne pas dramatiser ni minimiser)
- Garde les expressions personnelles et la personnalité unique
- Évite les formules trop poétiques ou alambiquées

**FORMAT :**
- Paragraphes courts et naturels
- Transitions simples entre les souvenirs
- Pas de sous-titres
- Raconte dans l'ordre chronologique quand c'est possible

Voici le témoignage à transformer :

${chapterContent}

Transforme cela en récit biographique authentique :`;

          const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
              {
                role: 'system',
                content:
                  "Tu es un biographe spécialisé dans les récits autobiographiques authentiques et fidèles aux témoignages originaux."
              },
              { role: 'user', content: prompt }
            ],
            max_tokens: 2000,
            temperature: 0.7
          });

          const content = completion?.choices?.[0]?.message?.content ?? '';

          return {
            title: chapter.title || `Chapitre ${index}`,
            content,
            index
          };
        } catch (err) {
          console.error(`Erreur sur le chapitre ${chapter?.title ?? index}:`, err);
          // Fallback : concat des segments si l’appel OpenAI échoue
          const safe = (chapter?.questions || [])
            .map((q) => (chapter?.segments || [])
              .filter((s) => s.questionId === q.id)
              .map((s) => s.text)
              .join(' ')
            )
            .filter(Boolean)
            .join('\n\n');

          return {
            title: chapter?.title || `Chapitre ${index}`,
            content: safe || '',
            index
          };
        }
      })
    );

    const validChapters = rewrittenChapters
      .filter(Boolean)
      .sort((a, b) => a.index - b.index);

    const htmlContent = createBookHTML(validChapters);

    return NextResponse.json({
      success: true,
      rewrittenContent: htmlContent,
      chaptersProcessed: validChapters.length
    });
  } catch (error) {
    console.error('Erreur OpenAI:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la réécriture', details: error?.message || String(error) },
      { status: 500 }
    );
  }
}

// --- Générateur HTML identique à ton code
function createBookHTML(chapters) {
  const title =
    '<h1 style="text-align: center; margin-bottom: 40px; color: #1f2937; font-size: 2.2em; font-family: serif;">Mon Histoire</h1>';

  const chaptersHTML = chapters
    .map((chapter, index) => {
      const chapterTitle =
        index === 0 ? `Préface : ${chapter.title}` : `Chapitre ${index} : ${chapter.title}`;

      const paras =
        (chapter.content || '')
          .split('\n\n')
          .map(p => p.trim())
          .filter(Boolean)
          .map(
            (paragraph) =>
              `<p style="margin-bottom: 20px; text-indent: 1.5em;">${paragraph}</p>`
          )
          .join('');

      return `
<h2 style="margin-top: 50px; margin-bottom: 25px; color: #1f2937; font-size: 1.6em; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px; font-family: serif;">
  ${chapterTitle}
</h2>
<div style="margin-bottom: 30px; text-align: justify; line-height: 1.8; color: #374151; font-family: serif;">
  ${paras}
</div>`;
    })
    .join('');

  const epilogue =
    '<div style="margin-top: 60px; padding: 25px; background-color: #f9fafb; border-radius: 12px; text-align: center; border-left: 4px solid #f59e0b;"><p style="color: #6b7280; font-style: italic; font-family: serif; margin: 0;">Ces souvenirs ont été rassemblés et mis en forme avec Elior, pour que cette histoire traverse les générations.</p></div>';

  return title + chaptersHTML + epilogue;
}
