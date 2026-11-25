import React, { useState, useEffect } from "react";
import { Ticket, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { toast } from "sonner";

interface HeroImage {
  _id: string;
  desktop: string;
  mobile: string;
  alt: string;
}

const API_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL || "";

const HeroSection: React.FC = () => {
  const { elementRef: statsRef, isVisible: statsVisible } =
    useScrollAnimation<HTMLDivElement>();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch hero banners set from Admin Dashboard
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/hero`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setHeroImages(Array.isArray(data) ? data : []);
      } catch {
        toast.error("Failed to load hero images");
        setHeroImages([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (heroImages.length <= 1 || loading) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length, loading]);

  return (
    <section className="w-full bg-black">

      {/* ── HERO CAROUSEL (from Admin / DB) ── */}
      <div className="relative w-full flex items-center justify-center overflow-hidden bg-black min-h-[40vh]">
        {loading ? (
          <div className="py-24 text-center text-white/50 text-sm">Loading…</div>
        ) : heroImages.length > 0 ? (
          <>
            {heroImages.map((image, index) => (
              <div
                key={image._id || index}
                className={`w-full transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0 absolute inset-0"
                  }`}
              >
                <picture className="block w-full h-auto">
                  <source media="(min-width:1024px)" srcSet={image.desktop} />
                  <source media="(max-width:720px)" srcSet={image.mobile} />
                  <img
                    src={image.desktop}
                    alt={image.alt || "Hornbill Music Festival"}
                    className="w-full h-auto block object-contain md:object-scale-down max-w-none"
                    style={{ width: "100vw", height: "auto", display: "block" }}
                  />
                </picture>
              </div>
            ))}

            {heroImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide
                      ? "bg-white w-8"
                      : "bg-white/50 hover:bg-white/75 w-2"
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          /* Fallback if no banners in DB yet */
          <picture>
            <source media="(min-width: 768px)" srcSet="/merchbanner.jpg" />
            <img
              src="/mob_merch.jpg"
              alt="Hornbill Music Festival Merchandise"
              className="w-full h-auto block object-cover object-center"
              loading="eager"
            />
          </picture>
        )}
      </div>

      {/* ── PREVIOUS STATIC / OVERLAY HERO (kept for reference) ──
      <div className="relative w-full overflow-hidden bg-black">
        <picture>
          <source media="(min-width: 768px)" srcSet="/audition_banner.jpeg?v=20260817" />
          <img
            src="/audition_banner_mob.jpeg?v=20260817"
            alt="Ticket to Hornbill - Band Auditions 2026"
            className="w-full h-auto block object-cover object-center"
            loading="eager"
          />
        </picture>
      </div>
      ── END STATIC HERO ── */}

      {/* ── BOOK TICKETS CTA (below banner) ── */}
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-2">
        <div className="rounded-2xl border border-festival-orange/30 bg-gradient-to-r from-[#1b2c23]/70 via-black/80 to-[#1b2c23]/70 backdrop-blur-md p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="text-center sm:text-left">
            <h2 className="font-righteous text-xl sm:text-2xl text-white">
              Hornbill Music Festival <span className="text-festival-orange">2026</span>
            </h2>
            <p className="text-gray-300 text-sm sm:text-base mt-1">
              Book your tickets now for 10 days of music, culture, and live performances.
            </p>
          </div>
          <a
            href="https://www.ahibi.in/hornbill-festival-2026"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto shrink-0"
          >
            <Button className="btn-festival w-full sm:w-auto px-6 py-5 text-base font-semibold rounded-xl flex items-center justify-center gap-2">
              <Ticket className="w-5 h-5" />
              <span>Book Tickets</span>
              <ExternalLink className="w-4 h-4" />
            </Button>
          </a>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div
          ref={statsRef}
          className={`grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-1000 ${statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
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
