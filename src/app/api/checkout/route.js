// src/app/api/checkout/route.js

// ✅ Force l’exécution côté Node (pas Edge) et évite tout pré‑rendu
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Petit helper pour générer un code lisible AAAA-BBBB
function generateCode() {
  const { randomBytes } = require("crypto");
  const raw = randomBytes(8).toString("base64url").toUpperCase().replace(/[^A-Z0-9]/g, "");
  return raw.slice(0, 4) + "-" + raw.slice(4, 8);
}

export async function POST(req) {
  try {
    // ⛳️ Import Stripe à l’exécution (pas au build)
    const { default: Stripe } = await import("stripe");

    // 🔐 Vérifs d’env (aident à diagnostiquer)
    const missing = [];
    if (!process.env.STRIPE_SECRET_KEY) missing.push("STRIPE_SECRET_KEY");
    if (!process.env.STRIPE_PRICE_ID) missing.push("STRIPE_PRICE_ID");
    if (!process.env.APP_URL) missing.push("APP_URL");
    if (missing.length) {
      throw new Error(`Missing env: ${missing.join(", ")}`);
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

    const { email, plan = "basic", successUrl, cancelUrl } = await req.json();
    const preAccessCode = generateCode();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email || undefined,
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url:
        (successUrl || `${process.env.APP_URL}/success`) +
        `?session_id={CHECKOUT_SESSION_ID}&code=${encodeURIComponent(preAccessCode)}`,
      cancel_url: cancelUrl || `${process.env.APP_URL}/purchase`,
      metadata: { plan, preAccessCode },
    });

    return new Response(JSON.stringify({ checkoutUrl: session.url }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    // 🔎 Expose l’erreur côté client pour debug rapide
    console.error("Checkout error:", e);
    return new Response(
      JSON.stringify({
        error: "Checkout failed",
        message: e?.message,
        code: e?.code,
        type: e?.type,
      }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
