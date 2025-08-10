// src/app/api/transcribe/route.js

import { NextResponse } from 'next/server';

// ✅ important : utiliser Node.js runtime (pas Edge)
export const runtime = 'nodejs';

export async function POST(request) {
  console.log('=== API Transcribe appelée ===');

  try {
    // 1) Vérif env
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ Clé OpenAI manquante');
      return NextResponse.json(
        { error: 'Clé OpenAI non configurée' },
        { status: 500 }
      );
    }

    // 2) Récupérer le fichier
    const formData = await request.formData();
    const audioFile = formData.get('audio');

    if (!audioFile) {
      console.error('❌ Aucun fichier audio');
      return NextResponse.json(
        { error: 'Aucun fichier audio fourni' },
        { status: 400 }
      );
    }

    // Sécurité basique
    if (typeof audioFile.size === 'number') {
      if (audioFile.size === 0) {
        return NextResponse.json({ error: 'Fichier audio vide' }, { status: 400 });
      }
      if (audioFile.size > 25 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'Fichier audio trop volumineux (max 25MB)' },
          { status: 400 }
        );
      }
    }

    console.log('✅ Fichier audio reçu:', {
      name: audioFile.name,
      size: audioFile.size,
      type: audioFile.type,
    });

    // 3) ✅ Import dynamique + client créé *dans* la requête (évite le bug de build)
    const { default: OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    console.log('🚀 Envoi à OpenAI Whisper…');

    // 4) Transcription
    const result = await openai.audio.transcriptions.create({
      file: audioFile,          // File (Web API) renvoyé par formData()
      model: 'whisper-1',
      language: 'fr',
      response_format: 'text',  // renvoie souvent un string
      temperature: 0.2,
    });

    const text = typeof result === 'string' ? result : result?.text || '';

    console.log('✅ Transcription réussie:', (text || '').slice(0, 100) + '…');

    return NextResponse.json({ success: true, transcription: text });
  } catch (error) {
    console.error('❌ Erreur dans l’API transcribe:', error);
    return NextResponse.json(
      {
        error: 'Erreur lors de la transcription',
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
