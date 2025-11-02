import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    // 1️⃣ Find the customer by email
    const customers = await stripe.customers.list({ email, limit: 1 });
    if (customers.data.length === 0) {
      return NextResponse.json(
        { message: "No customer found" },
        { status: 404 }
      );
    }
    const customer = customers.data[0];

    const paymentIntents = await stripe.paymentIntents.list({
      customer: customer.id,
      limit: 5, // latest 5 payments
    });

    const latestPayment = paymentIntents.data[0];

    const billingInfo = {
      email: customer.email,
      amountPaid: latestPayment.amount / 100,
      status: latestPayment.status,
      currency: latestPayment.currency,
      paymentMethod: latestPayment.payment_method_types?.[0],
      createdAt: new Date(latestPayment.created * 1000).toLocaleDateString(),
    };

    return NextResponse.json(billingInfo);
  } catch (error: any) {
    console.error("Error fetching billing info:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
