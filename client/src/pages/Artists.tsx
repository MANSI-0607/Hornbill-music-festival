import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

type Artist = {
  id: string;
  name: string;
  role: string;
  img: string;
  color: string;
  bio: string;
};

const ARTISTS: Artist[] = [
  {
    id: "a1",
    name: "Vox Nova",
    role: "Headliner / Electronic",
    img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&q=80&auto=format&fit=crop",
    color: "#ff2dd4",
    bio:
      "Vox Nova is a boundary-pushing electronic artist blending neon synth textures with kinetic drum programming. Their live sets are cinematic and euphoric, perfect for late-night festival energy.",
  },
  {
    id: "a2",
    name: "Luna Rave",
    role: "Psytrance / Live",
    img: "https://images.unsplash.com/photo-1507878866276-a947ef722fee?w=1200&q=80&auto=format&fit=crop",
    color: "#7c4dff",
    bio:
      "Luna Rave fuses otherworldly leads with deep rolling basslines. Expect immersive visuals and a kinetic crowd experience — a true cosmic rave.",
  },
  {
    id: "a3",
    name: "Neon Kai",
    role: "Indie Electronica",
    img: "https://images.unsplash.com/photo-1511376777868-611b54f68947?w=1200&q=80&auto=format&fit=crop",
    color: "#00e5ff",
    bio:
      "Neon Kai crafts intimate melodies inside big synthscapes. Their sets feel like a midnight drive: warm, reflective, and glowing.",
  },
  {
    id: "a4",
    name: "Chrome Tongue",
    role: "Experimental / DJ",
    img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80&auto=format&fit=crop",
    color: "#ff8a00",
    bio:
      "Chrome Tongue mixes analog grit with futuristic polish — expect modular chaos and precise drops that keep the crowd on edge.",
  },
];

export default function NeonArtistMarquee(): JSX.Element {
  const [selected, setSelected] = useState<Artist | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);

  // Accessibility: close with Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Duplicate artists so the marquee looks continuous
  const trackItems = [...ARTISTS, ...ARTISTS];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#05040a] to-[#07020f] p-6">
      {/* Inline keyframes for marquee */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <div className="w-full max-w-7xl">
        <header className="mb-12">
          <h1 className="text-4xl font-righteous text-neon-pink " >
            Festival Lineup
          </h1>
        </header>

        {/* Marquee wrapper */}
        <div
          className="relative overflow-hidden rounded-2xl"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          aria-hidden={false}
        >
          {/* Marquee track (duplicated) */}
          <div
            ref={trackRef}
            className="flex gap-6 items-stretch whitespace-nowrap"
            style={{
              // Use CSS animation for a smooth infinite marquee effect
              animation: `marquee ${trackItems.length * 2}s linear infinite`,
              animationPlayState: isPaused ? "paused" : "running",
            }}
          >
            {trackItems.map((a, idx) => (
              <ArtistCard
                key={`${a.id}-${idx}`}
                artist={a}
                onClick={() => setSelected(a)}
              />
            ))}
          </div>

          {/* subtle gradient edges for neon fade */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 bottom-0 w-24"
            style={{
              background:
                "linear-gradient(90deg, rgba(7,2,15,1), rgba(7,2,15,0))",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-24"
            style={{
              background:
                "linear-gradient(270deg, rgba(7,2,15,1), rgba(7,2,15,0))",
            }}
          />
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
              onClick={(e) => e.stopPropagation()}
            />

            <motion.div
              className="relative z-60 max-w-3xl w-full mx-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="rounded-2xl overflow-hidden border p-6"
                style={{
                  borderColor: "rgba(255,255,255,0.06)",
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.02), rgba(0,0,0,0.35))",
                  boxShadow: `0 12px 50px rgba(0,0,0,0.6), 0 0 40px ${selected.color}33`,
                }}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/3 rounded-lg overflow-hidden">
                    <img
                      src={selected.img}
                      alt={selected.name}
                      className="w-full h-60 object-cover"
                    />
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        mixBlendMode: "screen",
                        background: `linear-gradient(180deg, ${selected.color}22, transparent 40%)`,
                      }}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2
                          className="text-3xl font-extrabold text-neon-pink"
                      
                        >
                          {selected.name}
                        </h2>
                        <p className="mt-1 text-sm text-gray-300/90">
                          {selected.role}
                        </p>
                      </div>

                      <button
                        onClick={() => setSelected(null)}
                        className="ml-4 p-2 rounded-full hover:bg-white/5 focus:outline-none"
                        aria-label="Close"
                      >
                        <FiX className="w-6 h-6" />
                      </button>
                    </div>

                    <p className="mt-4 text-gray-200/90 leading-relaxed">
                      {selected.bio}
                    </p>

                    <div className="mt-6 flex items-center gap-4">
                      <button
                        className="px-5 py-2 rounded-full font-semibold text-black"
                        style={{
                          background: `linear-gradient(90deg, ${selected.color}, rgba(124,77,255,0.9))`,
                          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                        }}
                      >
                        Listen
                      </button>
                      <button className="px-4 py-2 rounded-full border border-white/8">
                        Read more
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- ArtistCard (framer-motion hover + tap) ---------- */
function ArtistCard({
  artist,
  onClick,
}: {
  artist: Artist;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.04, y: -8 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-72 min-w-[18rem] rounded-2xl p-0 overflow-hidden cursor-pointer border"
      style={{
        borderColor: "rgba(255,255,255,0.06)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.08))",
        boxShadow: `0 12px 40px rgba(0,0,0,0.6), 0 0 24px ${artist.color}22`,
      }}
      aria-label={`Open ${artist.name} bio`}
    >
      <div className="relative h-60 w-full">
        <img
          src={artist.img}
          alt={artist.name}
          className="w-full h-full object-cover block"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: `inset 0 0 40px ${artist.color}, 0 12px 40px ${artist.color}33`,
            mixBlendMode: "screen",
          }}
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-neon-pink">
          {artist.name}
        </h3>
        <p className="text-sm text-gray-300/90 mt-1">{artist.role}</p>
      </div>
    </motion.button>
  );
}
