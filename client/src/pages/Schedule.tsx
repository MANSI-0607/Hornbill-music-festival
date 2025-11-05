import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* Example 10-day schedule data — replace names/events with real ones */
const festivalSchedule = Array.from({ length: 10 }).map((_, idx) => {
  const day = idx + 1;
  return {
    id: day,
    label: `Dec ${day}`,
    fullLabel: `December ${day}`,
    events: [
      { time: "4:00 PM", artist: `Opening Act ${day}` },
      { time: "6:00 PM", artist: `Stage Headliner ${day}` },
      { time: "9:30 PM", artist: `Late Night DJ ${day}` },
    ],
  };
});

export default function ScheduleTabs() {
  const [active, setActive] = useState(0);
  const tabsRef = useRef<HTMLDivElement | null>(null);

  // ensure active tab is scrolled into view when changed
  useEffect(() => {
    const tabs = tabsRef.current;
    const activeBtn = tabs?.querySelectorAll<HTMLButtonElement>("button")[active];
    if (activeBtn && tabs) {
      const rect = activeBtn.getBoundingClientRect();
      const parentRect = tabs.getBoundingClientRect();
      // if button is out of view scroll smoothly to center it
      const isLeft = rect.left < parentRect.left + 12;
      const isRight = rect.right > parentRect.right - 12;
      if (isLeft || isRight) {
        const scrollTo = activeBtn.offsetLeft - tabs.clientWidth / 2 + activeBtn.clientWidth / 2;
        tabs.scrollTo({ left: scrollTo, behavior: "smooth" });
      }
    }
  }, [active]);

  return (
    <div className="min-h-screen px-6 py-12 bg-black text-white font-righteous">
      <motion.h1
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-6xl text-center mb-8 font-righteous text-neon-pink "
      >
        Festival Schedule
      </motion.h1>

      {/* Tabs container */}
      <div className="max-w-5xl mx-auto">
        <div className="relative">
          <div
            ref={tabsRef}
            className="flex gap-3 overflow-x-auto no-scrollbar py-3 px-1 rounded-xl border border-white/6 bg-white/2"
            role="tablist"
            aria-label="Festival days"
          >
         {festivalSchedule.map((day, i) => {
  const isActive = i === active;
  return (
    <div key={day.id} className="relative flex-shrink-0">
      <button
        onClick={() => setActive(i)}
        aria-selected={isActive}
        role="tab"
        className={`relative z-10 px-4 md:px-6 py-2 rounded-lg text-sm md:text-base whitespace-nowrap transition-colors focus:outline-none ${
          isActive
            ? "text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]"
            : "text-white/70 hover:text-white"
        }`}
      >
        {day.label}
      </button>

      {/* sliding pill indicator */}
      {isActive && (
        <motion.div
          layoutId="active-pill"
          className="absolute inset-0 m-0 rounded-lg"
          style={{
            background:
              "linear-gradient(90deg, var(--neon-pink), var(--neon-purple))",
            boxShadow: "0 6px 18px rgba(255,45,212,0.4)",
            zIndex: 0,
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 600, damping: 35 }}
        />
      )}
    </div>
  );
})}

          </div>

          {/* subtle border + glow under the tabs */}
          <div className="absolute left-0 right-0 -bottom-3 pointer-events-none">
            <div className="mx-auto max-w-5xl h-2 rounded-full opacity-40" />
          </div>
        </div>

        {/* Content area */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={festivalSchedule[active].id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="bg-[#05060a]/60 border border-[#ff2dd4]/20 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl md:text-3xl">
                    {festivalSchedule[active].fullLabel}
                  </h2>
                  <p className="text-sm text-white/70">Main Stage • Festival Grounds</p>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href="/tickets"
                    className="px-4 py-2 rounded-lg border border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-black transition shadow-[0_6px_20px_rgba(255,45,212,0.12)]"
                  >
                    Book Tickets
                  </a>
                </div>
              </div>

              {/* events list with stagger */}
              <motion.div
                initial="hidden"
                animate="show"
                exit="hidden"
                variants={{
                  hidden: {},
                  show: {},
                }}
                className="space-y-3"
              >
                {festivalSchedule[active].events.map((ev, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ delay: idx * 0.06, duration: 0.32 }}
                    className="flex items-center justify-between px-4 py-3 bg-white/3 border border-white/6 rounded-lg"
                  >
                    <div>
                      <div className="text-sm text-white/70">{ev.time}</div>
                      <div className="text-lg md:text-xl">{ev.artist}</div>
                    </div>
                    <div>
                      <button className="text-sm md:text-base px-3 py-1 rounded-md border border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-black transition">
                        View
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

             
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
