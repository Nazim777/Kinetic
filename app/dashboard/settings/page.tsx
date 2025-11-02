// 'use client';

// import React from 'react';
// import { motion } from 'framer-motion';
// import {  Monitor } from 'lucide-react';

// export default function SettingsPage() {
//   return (
//     <div className="w-full h-full overflow-y-auto px-8 py-10 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
//       {/* Page Header */}
//       <h1 className="text-3xl font-semibold mb-4 tracking-tight">Settings</h1>
//       <p className="text-gray-400 mb-10">
//         Customize your account, theme, and notification preferences below.
//       </p>

//       {/* Settings Grid */}
//       <div className="grid gap-6 md:grid-cols-2">
//         {/* Account Settings */}
       

//         {/* Appearance */}
//         <motion.div
//           whileHover={{ scale: 1.02 }}
//           transition={{ type: 'spring', stiffness: 200 }}
//           className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-sm"
//         >
//           <div className="flex items-center gap-3 mb-4">
//             <Monitor className="text-purple-500" size={22} />
//             <h2 className="text-xl font-medium">Appearance</h2>
//           </div>
//           <p className="text-sm text-gray-400 mb-6">
//             Switch between light and dark mode or system default.
//           </p>

//           <div className="flex gap-3">
//             {['Light', 'Dark', 'System'].map((theme) => (
//               <button
//                 key={theme}
//                 className="flex-1 bg-gray-800 border border-gray-700 hover:border-purple-500 py-2 rounded-lg text-sm transition"
//               >
//                 {theme}
//               </button>
//             ))}
//           </div>
//         </motion.div>       
//       </div>
//     </div>
//   );
// }



// "use client";

// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { User, Monitor } from "lucide-react";
// import { useTheme } from "next-themes";

// export default function SettingsPage() {
//   const { theme, setTheme, systemTheme } = useTheme();
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => setMounted(true), []);
//   if (!mounted) return null; // Avoid hydration mismatch

//   const currentTheme =
//     theme === "system" ? (systemTheme === "dark" ? "Dark" : "Light") : theme;

//   return (
//     <div className="w-full h-full overflow-y-auto px-8 py-10 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
//       {/* Page Header */}
//       <h1 className="text-3xl font-semibold mb-4 tracking-tight">Settings</h1>
//       <p className="text-gray-400 mb-10">
//         Customize your account, theme, and notification preferences below.
//       </p>

//       {/* Settings Grid */}
//       <div className="grid gap-6 md:grid-cols-2">
//         {/* Account Settings (placeholder for expansion) */}
//         <motion.div
//           whileHover={{ scale: 1.02 }}
//           transition={{ type: "spring", stiffness: 200 }}
//           className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-sm"
//         >
//           <div className="flex items-center gap-3 mb-4">
//             <User className="text-blue-500" size={22} />
//             <h2 className="text-xl font-medium">Account</h2>
//           </div>
//           <p className="text-sm text-gray-400 mb-6">
//             Manage your profile information and preferences.
//           </p>
//           <button className="bg-gray-800 border border-gray-700 hover:border-blue-500 py-2 px-4 rounded-lg text-sm transition">
//             Edit Profile
//           </button>
//         </motion.div>

//         {/* Appearance Settings */}
//         <motion.div
//           whileHover={{ scale: 1.02 }}
//           transition={{ type: "spring", stiffness: 200 }}
//           className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-sm"
//         >
//           <div className="flex items-center gap-3 mb-4">
//             <Monitor className="text-purple-500" size={22} />
//             <h2 className="text-xl font-medium">Appearance</h2>
//           </div>
//           <p className="text-sm text-gray-400 mb-6">
//             Switch between light, dark, or system default theme.
//           </p>

//           <div className="flex gap-3">
//             {["light", "dark", "system"].map((mode) => (
//               <button
//                 key={mode}
//                 onClick={() => setTheme(mode)}
//                 className={`flex-1 py-2 rounded-lg text-sm border transition ${
//                   theme === mode
//                     ? "border-purple-500 bg-purple-600/10 text-purple-400"
//                     : "border-gray-700 bg-gray-800 hover:border-purple-400"
//                 }`}
//               >
//                 {mode.charAt(0).toUpperCase() + mode.slice(1)}
//               </button>
//             ))}
//           </div>

//           <p className="mt-4 text-xs text-gray-500">
//             Current Theme:{" "}
//             <span className="text-gray-300 font-medium">{currentTheme}</span>
//           </p>
//         </motion.div>
//       </div>
//     </div>
//   );
// }



"use client";

import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Monitor, Trash2 } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import axios from "axios";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useSidebar } from "@/components/ui/sidebar";

export default function SettingsPage() {
  const context = useContext(UserDetailContext);
  if(!context) throw new Error('No context available')
    const {userDetail,setUserDetail} = context;
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
const {toggleSidebar} = useSidebar();
  useEffect(() => setMounted(true), []);
  if (!mounted) return null; // Prevent hydration mismatch

  const currentTheme =
    theme === "system" ? (systemTheme === "dark" ? "Dark" : "Light") : theme;

  // 🗑️ Simulate account deletion API call
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
     await axios.delete("/api/delete-account", {
        data: { email: userDetail?.email },
      });
      localStorage.removeItem('user')
      document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      setUserDetail(null);
      toggleSidebar();
      setShowDeleteDialog(false);
      //  router.push('/')
      window.location.reload()
      
    } catch (err) {
      alert("Failed to delete account. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto px-8 py-10 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
      {/* Page Header */}
      <h1 className="text-3xl font-semibold mb-4 tracking-tight">Settings</h1>
      <p className="text-gray-400 mb-10">
        Customize your account, theme, and preferences below.
      </p>

      {/* Settings Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Account Settings */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <User className="text-blue-500" size={22} />
              <h2 className="text-xl font-medium">Account</h2>
            </div>
            <p className="text-sm text-gray-400 mb-6">
              Manage your profile information or permanently delete your account.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 bg-gray-800 border-gray-700 hover:border-blue-500 text-sm"
            >
              Edit Profile
            </Button>

            <Button
              variant="destructive"
              className="flex items-center gap-2 text-sm"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 size={16} />
              Delete Account
            </Button>
          </div>
        </motion.div>

        {/* Appearance Settings */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <Monitor className="text-purple-500" size={22} />
            <h2 className="text-xl font-medium">Appearance</h2>
          </div>
          <p className="text-sm text-gray-400 mb-6">
            Switch between light, dark, or system default theme.
          </p>

          <div className="flex gap-3">
            {["light", "dark", "system"].map((mode) => (
              <button
                key={mode}
                onClick={() => setTheme(mode)}
                className={`flex-1 py-2 rounded-lg text-sm border transition ${
                  theme === mode
                    ? "border-purple-500 bg-purple-600/10 text-purple-400"
                    : "border-gray-700 bg-gray-800 hover:border-purple-400"
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>

          <p className="mt-4 text-xs text-gray-500">
            Current Theme:{" "}
            <span className="text-gray-300 font-medium">{currentTheme}</span>
          </p>
        </motion.div>
      </div>

      {/* 🗑️ Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-gray-900 border border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-red-500">Delete Account</DialogTitle>
            <DialogDescription className="text-gray-400">
              This action is permanent and cannot be undone. All your data will be
              deleted. Are you sure you want to continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 justify-end mt-6">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className="border-gray-700 hover:border-gray-500"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Yes, Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
