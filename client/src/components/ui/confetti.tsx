"use client";

import confetti from "canvas-confetti";

export function fireConfetti() {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#F21C65", "#F244C0", "#1ABC9C", "#F3E26C", "#D94E1F"],
  });
}
