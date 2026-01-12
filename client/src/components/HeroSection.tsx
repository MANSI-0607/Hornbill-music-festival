import React from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const HeroSection: React.FC = () => {
  const { elementRef: statsRef, isVisible: statsVisible } =
    useScrollAnimation<HTMLDivElement>();

  return (
    <section className="w-full bg-black">
      {/* HERO IMAGE SECTION */}
      <div className="relative w-full flex items-center justify-center overflow-hidden bg-black">
        <picture className="block w-full h-auto">
          {/* Desktop (≥1024px) */}
          <source media="(min-width:1024px)" srcSet="/TY.jpg" />
          {/* Mobile (≤720px) */}
          <source media="(max-width:720px)" srcSet="/TYmob.jpg" />

          {/* Responsive Image */}
          <img
            src="/TY.jpg"
            alt="Thank You - Hornbill Music Festival"
            className="
              w-full
              h-auto
              block
              object-contain
              md:object-scale-down
              max-w-none
            "
            style={{
              width: "100vw",
              height: "auto",
              display: "block",
            }}
          />
        </picture>
      </div>

        {/* STATS SECTION */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div
          ref={statsRef}
          className={`grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-1000 ${
            statsVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          {/* Stat 1 */}
          <div
            className={`festival-card text-center transition-all duration-700 py-3 ${
              statsVisible ? "animate-scale-in" : ""
            }`}
            style={{ animationDelay: statsVisible ? "0ms" : "0ms" }}
          >
            <div className="text-3xl md:text-4xl font-bold text-[#1e90ff] mb-1">
              25
            </div>
            <div className="text-gray-400 text-sm md:text-base">
              Years of Festival Legacy
            </div>
          </div>

          {/* Stat 2 */}
          <div
            className={`festival-card text-center transition-all duration-700 py-3 ${
              statsVisible ? "animate-scale-in" : ""
            }`}
            style={{ animationDelay: statsVisible ? "150ms" : "0ms" }}
          >
            <div className="text-3xl md:text-4xl font-bold text-neon-pink mb-1">
              10
            </div>
            <div className="text-gray-400 text-sm md:text-base">
              Days of Music &amp; Culture
            </div>
          </div>

          {/* Stat 3 */}
          <div
            className={`festival-card text-center transition-all duration-700 py-3 ${
              statsVisible ? "animate-scale-in" : ""
            }`}
            style={{ animationDelay: statsVisible ? "300ms" : "0ms" }}
          >
            <div className="text-3xl md:text-4xl font-bold text-electric-orange mb-1">
              800+
            </div>
            <div className="text-gray-400 text-sm md:text-base">Artists</div>
          </div>

          {/* Stat 4 */}
          <div
            className={`festival-card text-center transition-all duration-700 py-3 ${
              statsVisible ? "animate-scale-in" : ""
            }`}
            style={{ animationDelay: statsVisible ? "450ms" : "0ms" }}
          >
            <div className="text-3xl md:text-4xl font-bold text-neon-purple mb-1">
              3,00,000+
            </div>
            <div className="text-gray-400 text-sm md:text-base">Attendance</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;