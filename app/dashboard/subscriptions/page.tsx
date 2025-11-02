"use client";

import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Zap, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loadStripe } from "@stripe/stripe-js";
import { UserDetailContext } from "@/context/UserDetailContext";
import BillingInfo from "@/components/BillingInfo";

const lookup = {
  PRICING_DESC:
    "Start with a free account to speed up your workflow on public projects or boost your entire team with instantly-opening production environments.",
  PRICING_OPTIONS: [
    {
      name: "Free",
      tokens: "20K",
      value: 20000,
      desc: "Ideal for hobbyists and casual users.",
      price: 0.0,
      key: "FREE",
    },
    {
      name: "Starter",
      tokens: "120K",
      value: 120000,
      desc: "Designed for professionals who use Kinetic regularly.",
      price: 9.99,
      key: "STARTER",
    },
    {
      name: "Pro",
      tokens: "2.5M",
      value: 2500000,
      desc: "Perfect for teams or power users working daily.",
      price: 19.99,
      key: "PRO",
    },
    {
      name: "Unlimited",
      tokens: "Unlimited",
      value: 999999999,
      desc: "For agencies and companies needing unlimited access.",
      price: 49.99,
      key: "UNLIMITED",
    },
  ],
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function SubscriptionsPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const context = useContext(UserDetailContext);

  if (!context) {
    throw new Error("UserDetailContext is not available");
  }

  const { userDetail } = context;

  const handleCheckout = async (planKey: string) => {
    if (!userDetail?.email) {
      alert("Please log in to purchase a plan.");
      return;
    }

    setLoading(planKey);

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planKey, email: userDetail.email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const stripe = await stripePromise;
      if (!stripe) throw new Error("Failed to load Stripe");

      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } catch (err) {
      console.error(err);
      alert("Error starting checkout. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  console.log("userDetail:", userDetail?.tokens);
  console.log("userDetail plan:", userDetail?.currentPlan);
  return (
    <div className="p-8 w-full h-full overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-semibold mb-3 tracking-tight">
          My Subscriptions
        </h1>
        <p className="text-gray-400 mb-10 max-w-2xl">{lookup.PRICING_DESC}</p>
      </motion.div>

      <motion.div
        className="mb-4 flex items-center justify-center bg-blue-600 text-white flex-col gap-2 p-4 rounded-lg max-w-sm mx-auto"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="font-semibold text-lg">You have</h2>
        <h2>{userDetail?.tokens}</h2>
        <h2 className="font-semibold text-lg">tokens remaining</h2>
      </motion.div>

      {/* Pricing Grid */}
      <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
        {lookup.PRICING_OPTIONS.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{
              scale: 1.04,
              transition: { type: "spring", stiffness: 300 },
            }}
            className="relative bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/60 rounded-2xl p-6 shadow-lg hover:shadow-blue-900/30"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Zap className="text-blue-500" size={22} />
                <h2 className="text-xl font-semibold">{plan.name}</h2>
              </div>
              {plan.key === userDetail?.currentPlan && (
                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-md uppercase font-medium tracking-wide">
                  Current
                </span>
              )}
            </div>

            <p className="text-sm text-gray-400 mb-5">{plan.desc}</p>

            <div className="flex items-end gap-2 mb-5">
              <h3 className="text-3xl font-bold text-white">${plan.price}</h3>
              <span className="text-gray-400 text-sm">/month</span>
            </div>

            <div className="text-sm text-gray-400 mb-5">
              <span className="text-gray-300 font-medium">{plan.tokens}</span>{" "}
              tokens included
            </div>

            {plan.key === userDetail?.currentPlan ? (
              <Button
                disabled
                className="w-full py-2 text-sm rounded-xl bg-gray-700 text-gray-400 cursor-not-allowed"
              >
                Current Plan
              </Button>
            ) : plan.key === "FREE" ? (
              <Button
                disabled
                className="w-full py-2 text-sm rounded-xl bg-gray-700 text-gray-400 cursor-not-allowed"
              >
                Free
              </Button>
            ) : (
              <Button
                onClick={() => handleCheckout(plan.key)}
                disabled={loading === plan.key}
                className={`w-full py-2 text-sm rounded-xl flex items-center justify-center transition-all ${
                  plan.key === userDetail?.currentPlan
                    ? "bg-green-600 hover:bg-green-500 text-white"
                    : "bg-blue-600 hover:bg-blue-500 text-white"
                }`}
              >
                {loading === plan.key && (
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                )}
                {plan.key === userDetail?.currentPlan
                  ? "Manage Plan"
                  : loading === plan.key
                    ? "Processing..."
                    : "Upgrade"}
              </Button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Billing Info */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mt-12 bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-md max-w-3xl mx-auto"
      >
        <BillingInfo/>
      </motion.div>
    </div>
  );
}
