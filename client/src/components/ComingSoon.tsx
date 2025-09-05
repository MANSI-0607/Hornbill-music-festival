// src/components/ComingSoon.tsx
import React from "react";
import { motion } from "framer-motion";
import { Hourglass } from "lucide-react";

export default function ComingSoon() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-center px-6">
      <motion.div
        className="max-w-xl p-10 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-lg border border-yellow-400/40"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
          className="flex justify-center mb-6"
        >
          <Hourglass className="w-16 h-16 text-yellow-400" />
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-400 mb-4">
          Coming Soon
        </h1>
        <p className="text-blue-100 text-lg">
          Something amazing is on the way. <br />
          We&apos;re working hard to bring you an incredible experience.
        </p>
      </motion.div>
    </div>
  );
}
