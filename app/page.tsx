'use client'

import { motion } from "framer-motion";
import LoginDialog from "@/components/LoginDialog";
import { Button } from "@/components/ui/button";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const context = useContext(UserDetailContext);
  if (!context) throw new Error("UserDetailContext must be used within UserDetailProvider");

  const { userDetail } = context;
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter();

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = (isOpen: boolean) => setOpenDialog(isOpen);

  useEffect(() => {
    if (userDetail?.name) {
      setOpenDialog(false);
      router.push("/workspace");
    }
  }, [userDetail]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0d0d0d] to-[#1a1a1a] text-white overflow-hidden relative">
      {/* Background floating glow */}
      <motion.div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-blue-500 opacity-20 blur-[180px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      {/* Hero section */}
      <motion.div
        className="relative z-10 text-center px-6 md:px-0"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.h1
          className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Build Anything Instantly ⚡
        </motion.h1>

        <motion.p
          className="text-gray-400 max-w-2xl mx-auto mb-10 text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Type your idea, and let AI turn it into working code in seconds.
          Empower your next big project — faster than ever.
        </motion.p>

        {!userDetail?.name && (
          <motion.div
            className="flex gap-4 justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <Button
              className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold shadow-lg shadow-blue-500/30 hover:opacity-90 transition-all"
              onClick={handleOpenDialog}
            >
              Get Started
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Subtle floating icons or text animation */}
      <motion.div
        className="absolute bottom-12 text-gray-500 text-sm"
        animate={{ opacity: [0.5, 1, 0.5], y: [0, -4, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        Made with ❤️ using Next.js & Convex
      </motion.div>

      <LoginDialog openDialog={openDialog} closeDialog={handleCloseDialog} />
    </div>
  );
}
