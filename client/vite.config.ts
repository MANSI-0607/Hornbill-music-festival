import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import compression from "vite-plugin-compression";
import { imagetools } from "vite-imagetools";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: true,
    port: 8080,
  },
  plugins: [
    react(),
    imagetools(), // enables image optimization
    mode === "development" && componentTagger(),
    mode === "production" &&
      compression({
        algorithm: "brotliCompress",
        ext: ".br",
        threshold: 10240,
        quality: 11,
      }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2020",
    chunkSizeWarningLimit: 1000,
    sourcemap: mode === "development",
    minify: mode === "production" ? "esbuild" : false,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "router-vendor": ["react-router-dom"],
          "ui-vendor": ["lucide-react", "@radix-ui/react-dialog", "@radix-ui/react-select"],
          "form-vendor": ["react-hook-form", "@hookform/resolvers", "zod"],
        },
      },
    },
  },
  esbuild: {
    drop: mode === "production" ? ["console", "debugger"] : [],
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-select",
    ],
  },
  // Preserve original image quality
  assetsInclude: ["**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.webp", "**/*.svg", "**/*.gif"],
}));
