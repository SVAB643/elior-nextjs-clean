// src/app/api/transcribe/route.js
import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  console.log("=== API Transcribe appelée ===");
  
  try {
    // Vérifier la clé API
    if (!process.env.OPENAI_API_KEY) {
      console.error("❌ Clé OpenAI manquante");
      return NextResponse.json(
        { error: 'Clé OpenAI non configurée' },
        { status: 500 }
      );
    }

    console.log("✅ Clé OpenAI présente");

    // Récupérer les données du formulaire
    const formData = await request.formData();
    const audioFile = formData.get('audio');
    
    if (!audioFile) {
      console.error("❌ Aucun fichier audio");
      return NextResponse.json(
        { error: 'Aucun fichier audio fourni' },
        { status: 400 }
      );
    }

    console.log("✅ Fichier audio reçu:", {
      name: audioFile.name,
      size: audioFile.size,
      type: audioFile.type
    });

    // Vérifier la taille du fichier (max 25MB)
    if (audioFile.size > 25 * 1024 * 1024) {
      console.error("❌ Fichier trop volumineux:", audioFile.size);
      return NextResponse.json(
        { error: 'Fichier audio trop volumineux (max 25MB)' },
        { status: 400 }
      );
    }

    // Vérifier que le fichier n'est pas vide
    if (audioFile.size === 0) {
      console.error("❌ Fichier audio vide");
      return NextResponse.json(
        { error: 'Fichier audio vide' },
        { status: 400 }
      );
    }

    console.log("🚀 Envoi à OpenAI Whisper...");

    // Transcription avec Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: "fr", // Français
      response_format: "text",
      temperature: 0.2, // Pour plus de précision
    });

    console.log("✅ Transcription réussie:", transcription.substring(0, 100) + '...');

    return NextResponse.json({ 
      success: true, 
      transcription: transcription 
    });

  } catch (error) {
    console.error("❌ Erreur dans l'API transcribe:", error);
    
    // Log détaillé de l'erreur
    if (error.response) {
      console.error("Réponse OpenAI:", {
        status: error.response.status,
        data: error.response.data
      });
    }

    return NextResponse.json(
      { 
        error: 'Erreur lors de la transcription',
        details: error.message,
        type: error.constructor.name
      },
      { status: 500 }
    );
  }
}