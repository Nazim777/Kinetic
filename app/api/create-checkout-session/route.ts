import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion:'2025-02-24.acacia',
});


// Pricing lookup — same as your UI config
const PLANS = {
  BASIC: { name: "Basic", tokens: 50000, price: 4.99 },
  STARTER: { name: "Starter", tokens: 120000, price: 9.99 },
  PRO: { name: "Pro", tokens: 2500000, price: 19.99 },
  UNLIMITED: { name: "Unlimited (License)", tokens: 999999999, price: 49.99 },
};

export async function POST(req: Request) {
  try {
    const { planKey, email } = await req.json();

    if (!planKey || !email) {
      return NextResponse.json(
        { error: "Missing planKey or email" },
        { status: 400 }
      );
    }

    // @ts-ignore
    const selectedPlan = PLANS[planKey.toUpperCase()];
    if (!selectedPlan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const { name, tokens, price } = selectedPlan;

    // Stripe expects amount in cents
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${name} Plan (${tokens === 999999999 ? "Unlimited" : `${tokens.toLocaleString()} tokens`})`,
              description:
                tokens === 999999999
                  ? "Unlimited generation access for all features."
                  : `Includes ${tokens.toLocaleString()} generation tokens.`,
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/success?session_id={CHECKOUT_SESSION_ID}&tokens=${tokens}&planKey=${planKey}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/subscriptions`,
      client_reference_id: email,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("❌ Error creating Stripe checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session", details: String(error) },
      { status: 500 }
    );
  }
}
