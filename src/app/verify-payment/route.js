// src/app/api/verify-payment/route.js

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function generateFinalCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'ELIOR-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request) {
  try {
    // Import Stripe à l'exécution
    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { 
      apiVersion: "2024-06-20" 
    });

    const { sessionId, preCode } = await request.json();

    if (!sessionId) {
      return Response.json({ error: 'Session ID requis' }, { status: 400 });
    }

    // 1. Vérifier la session Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status !== 'paid') {
      return Response.json({ error: 'Paiement non confirmé' }, { status: 400 });
    }

    // 2. Vérifier si on a déjà créé un code pour cette session
    const { data: existingCode, error: checkError } = await supabase
      .from('codes')
      .select('*')
      .eq('stripe_session_id', sessionId)
      .maybeSingle(); // Utiliser maybeSingle() au lieu de single()

    if (existingCode) {
      // Code déjà créé pour cette session
      return Response.json({
        success: true,
        code: existingCode.code,
        email: existingCode.customer_email,
      });
    }

    // 3. Générer un nouveau code final unique
    let finalCode;
    let attempts = 0;
    const maxAttempts = 10;
    
    do {
      finalCode = generateFinalCode();
      const { data: existing } = await supabase
        .from('codes')
        .select('id')
        .eq('code', finalCode)
        .maybeSingle();
      
      if (!existing) break;
      attempts++;
    } while (attempts < maxAttempts);

    if (attempts >= maxAttempts) {
      return Response.json({ error: 'Impossible de générer un code unique' }, { status: 500 });
    }

    // 4. Sauvegarder le code dans la base
    const { data: newCode, error: insertError } = await supabase
      .from('codes')
      .insert([
        {
          code: finalCode,
          stripe_session_id: sessionId,
          customer_email: session.customer_email || session.customer_details?.email,
          used: false,
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Erreur insertion code:', insertError);
      return Response.json({ 
        error: 'Erreur lors de la création du code',
        details: insertError.message 
      }, { status: 500 });
    }

    console.log('✅ Code créé avec succès:', finalCode);

    return Response.json({
      success: true,
      code: finalCode,
      email: newCode.customer_email,
    });

  } catch (error) {
    console.error('❌ Erreur verify-payment:', error);
    return Response.json({ 
      error: 'Erreur serveur',
      details: error.message 
    }, { status: 500 });
  }
}