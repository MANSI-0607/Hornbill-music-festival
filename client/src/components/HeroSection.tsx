// src/components/HeroSection.tsx
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import hero1 from "@/assets/hornbillMusic (1).jpg";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const festivalStartDate = new Date("2025-12-01T00:00:00");
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = festivalStartDate.getTime() - now.getTime();
      setDaysLeft(Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0));
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 86400000); // update daily
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center pt-24 md:pt-28">
      {/* Background image covering entire section */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url("${hero1}")` }}
      />
      {/* Gradient shade overlay (keep the golden-to-navy tone) */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#FFD700]/25 via-transparent to-[#0A2342]/50" />

      <div className="relative z-20 max-w-6xl mx-auto px-6 md:px-10 w-full">
        {/* LEFT CONTENT (centered) */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 text-center"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight drop-shadow">
            <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-600 text-transparent bg-clip-text drop-shadow-lg">
              Hornbill Music Festival
            </span>
            <br />
            <span className="text-white drop-shadow-sm">
              Where Culture Meets Sound
            </span>
          </h1>

          <p className="text-2xl md:text-3xl text-white font-semibold tracking-wide">
            1st – 10th December, 2025 <br />
            <span className="text-[#FDE68A] font-bold">
              Venue: Naga Heritage Village Kisama, Nagaland
            </span>
          </p>

          {daysLeft !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 text-transparent bg-clip-text drop-shadow-lg"
            >
              {daysLeft} Days Left
            </motion.div>
          )}

          <p className="text-xl md:text-2xl text-white/90 font-semibold text-center ">
            Auditions are live
          </p>

          <Link to="/auditions">
            <Button
              className="group relative overflow-hidden text-2xl md:text-[26px] font-extrabold rounded-full px-12 py-6 text-[#0A2342]
              bg-gradient-to-r from-yellow-400 to-amber-500 shadow-[0_14px_34px_rgba(234,179,8,0.55)]
              hover:shadow-[0_18px_40px_rgba(234,179,8,0.7)] transition-transform duration-200 hover:scale-105
              focus:outline-none focus:ring-4 focus:ring-[#FDE68A]"
            >
              <span className="relative z-10">Submit Audition</span>
              <span
                className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200
                bg-gradient-to-r from-amber-500 to-yellow-400"
              />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
