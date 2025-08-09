// src/app/api/checkout/route.js
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

// petit générateur de code lisible (ex: 3Y9K-PA7D)
function generateCode(len = 8) {
  const raw = Buffer.from(crypto.randomUUID()).toString("base64").toUpperCase().replace(/[^A-Z0-9]/g, "");
  return raw.slice(0, 4) + "-" + raw.slice(4, 8);
}

export async function POST(req) {
  try {
    const { email, plan = "basic", successUrl, cancelUrl } = await req.json?.() || {};

    // on génère un code provisoire et on le place dans l’URL de succès + metadata
    const preAccessCode = generateCode();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      customer_email: email || undefined,
      success_url: (successUrl || `${process.env.APP_URL}/success`) +
        `?session_id={CHECKOUT_SESSION_ID}&code=${encodeURIComponent(preAccessCode)}`,
      cancel_url: cancelUrl || `${process.env.APP_URL}/purchase`,
      metadata: {
        plan,
        preAccessCode
      },
    });

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (e) {
    console.error("Checkout error:", e);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
