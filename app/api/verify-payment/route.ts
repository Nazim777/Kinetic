import { NextResponse } from "next/server";
import Stripe from "stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
  try {
    const { sessionId, email, tokens, planKey } = await req.json();

    if (!sessionId || !email || !tokens || !planKey) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Verify Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { success: false, error: "Payment not completed" },
        { status: 400 }
      );
    }

    // ✅ Check for duplicate session
    const existing = await convex.query(api.payments.GetPaymentBySession, {
      sessionId,
    });
    if (existing) {
      return NextResponse.json({ success: true, message: "Already processed" });
    }

    // ✅ Update user's tokens
    const updatedUser = await convex.mutation(api.user.UpdateTokens, {
      email,
      tokens,
      planKey
    });

    // ✅ Record payment
    await convex.mutation(api.payments.RecordPayment, {
      email,
      sessionId,
      tokens,
      planKey,
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
