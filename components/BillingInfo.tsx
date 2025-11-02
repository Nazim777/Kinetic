"use client";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CreditCard, CheckCircle } from "lucide-react";
import { UserDetailContext } from "@/context/UserDetailContext";

export default function BillingInfo() {
  const context = useContext(UserDetailContext);
  if (!context) throw new Error('Context not available!');
  const { userDetail } = context;
  const [billing, setBilling] = useState<any>(null);

  useEffect(() => {
    const fetchBilling = async () => {
      if (!userDetail?.email) return;
      const res = await axios.post("/api/billing-info", {
        email: userDetail.email,
      });
      setBilling(res.data);
    };
    fetchBilling();
  }, [userDetail]);

  if (!billing)
    return <p className="text-gray-500 text-sm text-center mt-6">No billing info found.</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="mt-12 bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-md max-w-3xl mx-auto"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium flex items-center gap-2">
          <CreditCard className="text-purple-500" size={22} />
          Billing Details
        </h2>
        <div className="flex items-center gap-2 text-green-500 text-sm">
          <CheckCircle size={16} />
          <span>{billing.status === "succeeded" ? "Paid" : "Pending"}</span>
        </div>
      </div>

      <p className="text-sm text-gray-400 mb-4">
        {billing.paymentMethod?.toUpperCase() || "CARD"} ending in{" "}
        <span className="text-gray-200 font-medium">{billing.cardLast4 || "****"}</span>
      </p>

      <p className="text-sm text-gray-400 mb-4">
        Amount Paid:{" "}
        <span className="text-gray-200 font-medium">
          {billing.amountPaid} {billing.currency?.toUpperCase() || "USD"}
        </span>
      </p>

      <p className="text-sm text-gray-400 mb-6">
        Payment Date:{" "}
        <span className="text-gray-200 font-medium">{billing.createdAt}</span>
      </p>

      <Button variant="outline" className="w-full hover:bg-gray-800">
        Update Payment Method
      </Button>
    </motion.div>
  );
}
