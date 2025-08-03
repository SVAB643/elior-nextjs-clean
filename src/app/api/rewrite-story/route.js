import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { chapters } = await req.json();
    
    if (!chapters || chapters.length === 0) {
      return Response.json({ error: 'Aucun chapitre fourni' }, { status: 400 });
    }

    console.log('Début de la réécriture par chapitre...');

    // Traiter chaque chapitre séparément
    const rewrittenChapters = await Promise.all(
      chapters.map(async (chapter, index) => {
        if (chapter.segments.length === 0) return null;

        // Préparer le contenu du chapitre
        const segmentsByQuestion = chapter.segments.reduce((acc, segment) => {
          const questionId = segment.questionId;
          if (!acc[questionId]) acc[questionId] = [];
          acc[questionId].push(segment);
          return acc;
        }, {});

        const answeredQuestions = chapter.questions.filter(q => segmentsByQuestion[q.id]);
        
        const chapterContent = answeredQuestions.map(question => 
          `Question: ${question.text}\nRéponse: ${segmentsByQuestion[question.id].map(s => s.text).join(' ')}`
        ).join('\n\n');

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

        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: "Tu es un biographe spécialisé dans les récits autobiographiques authentiques et fidèles aux témoignages originaux."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            max_tokens: 2000,
            temperature: 0.7,
          });

          return {
            title: chapter.title,
            content: completion.choices[0].message.content,
            index: index
          };
        } catch (error) {
          console.error(`Erreur chapitre ${chapter.title}:`, error);
          // Fallback : contenu original
          return {
            title: chapter.title,
            content: answeredQuestions.map(q => 
              segmentsByQuestion[q.id].map(s => s.text).join(' ')
            ).join('\n\n'),
            index: index
          };
        }
      })
    );

    // Filtrer les chapitres vides et trier
    const validChapters = rewrittenChapters
      .filter(chapter => chapter !== null)
      .sort((a, b) => a.index - b.index);

    // Créer le HTML final
    const htmlContent = createBookHTML(validChapters);
    
    return Response.json({ 
      success: true, 
      rewrittenContent: htmlContent,
      chaptersProcessed: validChapters.length
    });

  } catch (error) {
    console.error('Erreur OpenAI:', error);
    return Response.json({ 
      error: 'Erreur lors de la réécriture',
      details: error.message 
    }, { status: 500 });
  }
}

// Fonction pour créer le HTML du livre
function createBookHTML(chapters) {
  const title = '<h1 style="text-align: center; margin-bottom: 40px; color: #1f2937; font-size: 2.2em; font-family: serif;">Mon Histoire</h1>';
  
  const chaptersHTML = chapters.map((chapter, index) => {
    const chapterTitle = index === 0 ? 
      `Préface : ${chapter.title}` : 
      `Chapitre ${index} : ${chapter.title}`;
    
    return `
<h2 style="margin-top: 50px; margin-bottom: 25px; color: #1f2937; font-size: 1.6em; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px; font-family: serif;">
  ${chapterTitle}
</h2>
<div style="margin-bottom: 30px; text-align: justify; line-height: 1.8; color: #374151; font-family: serif;">
  ${chapter.content.split('\n\n').map(paragraph => 
    `<p style="margin-bottom: 20px; text-indent: 1.5em;">${paragraph.trim()}</p>`
  ).join('')}
</div>`;
  }).join('');

  const epilogue = '<div style="margin-top: 60px; padding: 25px; background-color: #f9fafb; border-radius: 12px; text-align: center; border-left: 4px solid #f59e0b;"><p style="color: #6b7280; font-style: italic; font-family: serif; margin: 0;">Ces souvenirs ont été rassemblés et mis en forme avec Elior, pour que cette histoire traverse les générations.</p></div>';

  return title + chaptersHTML + epilogue;
}