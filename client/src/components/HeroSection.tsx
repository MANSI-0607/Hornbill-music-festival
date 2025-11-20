// export default HeroSection;
import React, { useState, useEffect } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

import { toast } from "sonner";

const HeroSection: React.FC = () => {
  const { elementRef: statsRef, isVisible: statsVisible } =
    useScrollAnimation<HTMLDivElement>();

  const [currentSlide, setCurrentSlide] = useState(0);

  const [heroImages, setHeroImages] = useState<Array<{
    _id: string;
    desktop: string;
    mobile: string;
    alt: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
const API_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL || "";
 useEffect(() => {
  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/hero`);
      const data = await res.json();
      setHeroImages(data);
    } catch (e) {
      toast.error('Failed to load hero images');
    } finally {
      setLoading(false);
    }
  };

  load();
}, []);


  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (heroImages.length <= 1 || loading) return; // Don't auto-advance if only 1 image or still loading
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length, loading]);

  // Show loading state
  // if (loading) {
  //   return (
  //     <section className="w-full bg-black min-h-[60vh] flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
  //         <p className="mt-4 text-white">Loading hero images...</p>
  //       </div>
  //     </section>
  //   );
  // }

  // // Show error state
  // if (error || heroImages.length === 0) {
  //   return (
  //     <section className="w-full bg-black min-h-[60vh] flex items-center justify-center">
  //       <div className="text-center">
  //         <p className="text-red-500">Failed to load hero images</p>
  //         <p className="text-gray-400 mt-2">Please try again later</p>
  //       </div>
  //     </section>
  //   );
  // }

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