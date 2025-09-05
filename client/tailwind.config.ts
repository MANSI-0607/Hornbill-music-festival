import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "#E6E6E6",
        input: "#FFF4F2",
        ring: "#FFD54F",
        background: "#F9FAFB", // light neutral background
        foreground: "#1E293B", // dark navy text

        // Primary festival palette
        primary: {
          DEFAULT: "#FFD700", // golden yellow (Hornbill text)
          foreground: "#1E293B", // dark readable text
        },
        secondary: {
          DEFAULT: "#1E3A8A", // royal blue
          foreground: "#FFFFFF", // white text on blue
        },
        accent: {
          DEFAULT: "#00B8D9", // cyan accent
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#E5E7EB", // soft gray
          foreground: "#374151", // gray text
        },
        card: {
          DEFAULT: "#FFFFFF", // white card background
          foreground: "#1E293B", // readable text
        },

        // Special festival tones (for CTA highlights, decorations, etc.)
        "festival-gold": "#FFD700",
        "festival-blue": "#0A2342",
        "festival-cyan": "#00B8D9",
        "festival-pink": "#E91E63",

        // Remove old funky vars if not needed, but keeping here for safety
        vividPink: "var(--color-vivid-pink)",
        brightPink: "var(--color-bright-pink)",
        brightYellow: "var(--color-bright-yellow)",
        greenCyan: "var(--color-green-cyan)",
        cyan: "var(--color-cyan)",
      },
      fontFamily: {
        righteous: ["Righteous", "cursive"], // already present
        headline: ["Monoton", "cursive"], // funky headline font
        funky: ["Rubik Distressed", "cursive"], // festival graffiti-like
        groovy: ["Fugaz One", "cursive"], // retro funky
        body: ["Quicksand", "Poppins", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },

      animation: {
        "festival-bounce": "bounce 1.5s infinite",
        "festival-pulse": "pulse 2s ease-in-out infinite",
        "gradient-shift": "gradient-shift 3s ease infinite",
        "mobile-slide-up": "mobile-slide-up 0.3s ease-out",
        "scroll-reveal": "scroll-reveal 0.8s ease-out",
        "stagger-fade-in": "stagger-fade-in 0.6s ease-out",
      },
      keyframes: {
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "festival-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 20px hsl(50 100% 50% / 0.5)", // golden glow
          },
          "50%": {
            boxShadow:
              "0 0 40px hsl(50 100% 50% / 0.8), 0 0 60px hsl(220 100% 60% / 0.6)", // gold + blue glow
          },
        },
        "scroll-reveal": {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "stagger-fade-in": {
          from: { opacity: "0", transform: "translateY(20px) scale(0.95)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "mobile-slide-up": {
          from: { transform: "translateY(100%)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
