import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function POST(req) {
  const sig = headers().get("stripe-signature");
  const raw = await req.text(); // important: pas req.json()

  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const code = session.metadata?.preAccessCode; // mis par /api/checkout
    await supabaseAdmin.from("access_codes").upsert({
      code,
      status: "issued",
      plan: session.metadata?.plan || "basic",
      stripe_checkout_id: session.id,
      stripe_payment_intent: session.payment_intent,
      metadata: { email: session.customer_details?.email }
    });
  }

  return NextResponse.json({ received: true });
}
