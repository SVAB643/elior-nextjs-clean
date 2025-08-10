// src/app/api/checkout/route.js

// ✅ Forcer Node.js (pas Edge)
export const runtime = "nodejs";
// (optionnel) éviter toute tentative de pré‑rendu
export const dynamic = "force-dynamic";

function generateCode() {
  // petit code lisible 8 chars -> AAAA-BBBB
  // import dynamique pour éviter toute résolution à build-time
  const { randomBytes } = require("crypto");
  const raw = randomBytes(8).toString("base64url").toUpperCase().replace(/[^A-Z0-9]/g, "");
  return raw.slice(0, 4) + "-" + raw.slice(4, 8);
}

export async function POST(req) {
  try {
    const { default: Stripe } = await import("stripe"); // ✅ import dynamique
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

    const { email, plan = "basic", successUrl, cancelUrl } = await req.json();
    const preAccessCode = generateCode();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      customer_email: email || undefined,
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
    console.error("Checkout error:", e);
    return new Response(JSON.stringify({ error: "Checkout failed" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
