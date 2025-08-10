// src/app/api/stripe/webhook/route.js
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export const runtime = "nodejs"; // forcer Node, pas Edge

export async function POST(req) {
  // --- 1) Lire raw body + signature ---
  const sig = headers().get("stripe-signature");
  const raw = await req.text();

  // --- 2) Import dynamique de Stripe (aucun side-effect au build) ---
  const { default: Stripe } = await import("stripe");
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

  // --- 3) Vérifier la signature ---
  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature error:", err);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // --- 4) Traiter l'event ---
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const code = session.metadata?.preAccessCode;
    if (!code) {
      console.warn("checkout.session.completed sans preAccessCode", session.id);
      return NextResponse.json({ received: true, note: "no code" });
    }

    // Import dynamique de supabase-js (évite d'embarquer un util qui pullerait OpenAI)
    const { createClient } = await import("@supabase/supabase-js");
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { error } = await supabaseAdmin.from("access_codes").upsert({
      code,
      status: "issued",
      plan: session.metadata?.plan || "basic",
      stripe_checkout_id: session.id,
      stripe_payment_intent: session.payment_intent,
      metadata: { email: session.customer_details?.email },
    });

    if (error) {
      console.error("Supabase upsert error:", error);
      return NextResponse.json({ ok: false }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
