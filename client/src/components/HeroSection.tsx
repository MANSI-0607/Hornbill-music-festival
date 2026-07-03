import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const HeroSection: React.FC = () => {
  const { elementRef: statsRef, isVisible: statsVisible } =
    useScrollAnimation<HTMLDivElement>();

  return (
    <section className="w-full bg-black">

      {/* ── HERO IMAGE + OVERLAY ── */}
      <div className="relative w-full flex items-center justify-center overflow-hidden bg-black">
        <picture className="block w-full h-auto">
          <source media="(min-width:1024px)" srcSet="/new.png" />
          <source media="(max-width:720px)" srcSet="/new2.png" />
          <img
            src="/new.png"
            alt="Hero - Hornbill Music Festival"
            className="w-full h-auto block object-contain md:object-scale-down max-w-none"
            style={{ width: "100vw", height: "auto", display: "block" }}
          />
        </picture>

        {/* Stronger fade so the image steps back and the text owns the space */}
        <div className="absolute inset-0 bg-black/55 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

        {/* ── OVERLAY ── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 sm:px-16 pointer-events-none select-none">

          {/* Eyebrow */}
          <p className="text-[10px] sm:text-xs tracking-[0.35em] uppercase text-white/40 font-medium mb-4 sm:mb-6 lg:mb-8">
            Est. 2000 &nbsp;·&nbsp; Nagaland, India
          </p>

          {/* ── MAIN TITLE — one unified name ── */}
          <h1 className="font-righteous leading-none text-center">

            {/* "HORNBILL" */}
            <span className="block text-[15vw] sm:text-[13vw] md:text-[12vw] lg:text-[11vw] xl:text-[10vw] text-white tracking-tight">
              Hornbill
            </span>

            {/* "MUSIC FESTIVAL" — half the size of Hornbill, same visual family */}
            <span
              className="block text-white/90 tracking-[0.15em] sm:tracking-[0.2em] uppercase"
              style={{ fontSize: "clamp(1.1rem, 6vw, 5.5rem)", marginTop: "0.15em" }}
            >
              <span style={{ color: "#1e90ff" }}>Music</span>
              {" "}
              <span style={{ color: "#ff6b00" }}>Festival</span>
            </span>
          </h1>

          {/* Blue-to-orange gradient rule */}
          <div
            className="w-16 sm:w-24 lg:w-36 h-[2px] my-5 sm:my-7 lg:my-8"
            style={{ background: "linear-gradient(90deg, #1e90ff, #ff6b00)" }}
          />

          {/* Tagline — bigger on desktop */}
          <p className="text-white/55 text-sm sm:text-lg md:text-xl lg:text-2xl font-light tracking-wide">
            Auditions 2026 are open —&nbsp;
            <span className="text-white/90 font-normal">your stage awaits.</span>
          </p>

          {/* CTA — animated gradient border */}
          <div className="mt-7 sm:mt-9 lg:mt-11 pointer-events-auto">
            {/* Wrapper spins the gradient border */}
            <div className="relative inline-flex p-[2px] rounded-sm"
              style={{
                background: "linear-gradient(90deg, #1e90ff, #ff6b00, #1e90ff)",
                backgroundSize: "200% auto",
                animation: "border-spin 3s linear infinite",
              }}
            >
              <Link
                to="/auditions"
                className="group relative inline-flex items-center gap-3 bg-black/80 hover:bg-black/60 text-white px-8 sm:px-11 lg:px-14 py-3 sm:py-4 text-sm sm:text-base lg:text-lg font-medium tracking-widest uppercase transition-all duration-300"
              >
                Apply for Auditions
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>

          <style>{`
            @keyframes border-spin {
              0%   { background-position: 0% center; }
              100% { background-position: 200% center; }
            }
          `}</style>

        </div>
      </div>

      {/* ── STATS ── */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div
          ref={statsRef}
          className={`grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-1000 ${
            statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div
            className={`festival-card text-center transition-all duration-700 py-3 ${statsVisible ? "animate-scale-in" : ""}`}
            style={{ animationDelay: statsVisible ? "0ms" : "0ms" }}
          >
            <div className="text-3xl md:text-4xl font-bold text-[#1e90ff] mb-1">25</div>
            <div className="text-gray-400 text-sm md:text-base">Years of Festival Legacy</div>
          </div>

          <div
            className={`festival-card text-center transition-all duration-700 py-3 ${statsVisible ? "animate-scale-in" : ""}`}
            style={{ animationDelay: statsVisible ? "150ms" : "0ms" }}
          >
            <div className="text-3xl md:text-4xl font-bold text-neon-pink mb-1">10</div>
            <div className="text-gray-400 text-sm md:text-base">Days of Music &amp; Culture</div>
          </div>

          <div
            className={`festival-card text-center transition-all duration-700 py-3 ${statsVisible ? "animate-scale-in" : ""}`}
            style={{ animationDelay: statsVisible ? "300ms" : "0ms" }}
          >
            <div className="text-3xl md:text-4xl font-bold text-electric-orange mb-1">800+</div>
            <div className="text-gray-400 text-sm md:text-base">Artists</div>
          </div>

          <div
            className={`festival-card text-center transition-all duration-700 py-3 ${statsVisible ? "animate-scale-in" : ""}`}
            style={{ animationDelay: statsVisible ? "450ms" : "0ms" }}
          >
            <div className="text-3xl md:text-4xl font-bold text-neon-purple mb-1">3,00,000+</div>
            <div className="text-gray-400 text-sm md:text-base">Attendance</div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;
