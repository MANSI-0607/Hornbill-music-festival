// src/components/HeroSection.tsx
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import hero1 from "@/assets/hornbillMusic (1).jpg";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import herobanner from "../assets/banners/heroBanner.png";

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
    <section className="bg-[#F9FAFB] py-10 md:py-16 mt-14">
      <div className="max-w-8xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-8">
        
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 text-center md:text-left px-6 md:px-8"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
            <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-600 text-transparent bg-clip-text drop-shadow-lg">
              Hornbill Music Festival
            </span>
            <br />
            <span className="text-[#0A2342] drop-shadow-sm">
              Where Culture Meets Sound
            </span>
          </h1>

          <p className="text-lg text-[#1E293B] font-semibold tracking-wide">
            1st – 10th December, 2025 <br />
            <span className="text-[#1E3A8A]">
              Venue: Naga Heritage Village Kisama, Nagaland
            </span>
          </p>

          {daysLeft !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-yellow-400 text-transparent bg-clip-text"
            >
              🎉 {daysLeft} Days Left!
            </motion.div>
          )}

          <p className="text-md text-[#374151] font-medium">
            Auditions and Pre-Ticket sales are live
          </p>

          <Link to="/auditions">
            <Button className="bg-[#FFD700] text-[#0A2342] font-bold px-8 py-4 rounded-lg shadow-lg hover:bg-[#e6c200] transition transform hover:scale-105">
              Apply Now
            </Button>
          </Link>
        </motion.div>

        {/* RIGHT BANNER */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-full h-80 md:h-[550px] overflow-hidden shadow-xl rounded-2xl mr-1"
        >
          <img
            src={hero1}
            alt="Hornbill Festival"
            className="w-full h-full object-fill"
          />
          {/* Golden Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/40 via-transparent to-[#0A2342]/60"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
