

// export default HeroSection;
import React, { useState, useEffect } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const HeroSection: React.FC = () => {
  const { elementRef: statsRef, isVisible: statsVisible } =
    useScrollAnimation<HTMLDivElement>();

  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero images array - add more images here
  const heroImages = [
    {
      desktop: "/hero.jpg",
      mobile: "https://res.cloudinary.com/dwznqrjgg/image/upload/v1762779683/HMF_25_Reel_on2m1n.jpg",
      alt: "Hornbill Music Festival 2025"
    },
   
    {
      desktop: "/new.png",
      mobile: "/new2.png",
      alt: "Image description"
    },
  ];

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (heroImages.length <= 1) return; // Don't auto-advance if only 1 image
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <section className="w-full bg-black">
      {/* HERO CAROUSEL SECTION */}
      <div className="relative w-full flex items-center justify-center overflow-hidden bg-black">
        {/* Carousel Images */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`w-full transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0 absolute inset-0"
            }`}
          >
            <picture className="block w-full h-auto">
              {/* Desktop (≥1024px) */}
              <source media="(min-width:1024px)" srcSet={image.desktop} />
              {/* Mobile (≤720px) */}
              <source media="(max-width:720px)" srcSet={image.mobile} />

              {/* Responsive Image */}
              <img
                src={image.desktop}
                alt={image.alt}
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
        ))}

        {/* Carousel Indicators (only show if more than 1 image) */}
        {heroImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-white w-8"
                    : "bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
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