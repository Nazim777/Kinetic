"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";
import {toast} from 'sonner'

export default function SuccessPage() {
  const params = useSearchParams();
  const sessionId = params?.get("session_id");
  const tokens = Number(params?.get("tokens") || 0);
  const planKey = params?.get("planKey") || null;
  const router = useRouter();
  const context = useContext(UserDetailContext);
  if (!context) {
    throw new Error("UserDetailContext is not available");
  }
  const {userDetail,setUserDetail} = context;
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId || !userDetail?._id || !tokens) return;

      try {
        const res = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            email: userDetail.email,
            tokens,
            planKey
          }),
        });
        const data = await res.json();

        if (data.success) {
          router.push("/workspace");
        } else {
          toast.error("Payment verification failed. Please contact support.");
          console.error("Payment not verified:", data.error);
        }
      } catch (err) {
        console.error("Error verifying payment:", err);
        toast.error("Payment verification failed. Please contact support.");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId, tokens, userDetail, router, setUserDetail]);

  return (
    <div className="p-6 text-center">
      {isVerifying ? (
        <h2 className="text-xl ">Verifying your payment...</h2>
      ) : (
        <h2 className="text-2xl font-bold ">
          🎉 Payment Successful!
        </h2>
      )}
      <p>You purchased {tokens} tokens.</p>
    </div>
  );
}
