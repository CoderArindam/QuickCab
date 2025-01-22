import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate", // Ensures the PWA auto-updates.
      includeAssets: [
        "favicon-16x16.png",
        "favicon-32x32.png",
        "favicon.ico",
        "apple-touch-icon.png",
      ],
      manifest: {
        name: "QuiCab",
        short_name: "QuiCab",
        description: "Ride. Quick. Now!",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        id: "/",
        icons: [
          {
            src: "android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        screenshots: [
          {
            src: "screenshot-wide.png",
            sizes: "1917x939",
            type: "image/png",
            form_factor: "wide", // For desktop
          },
          {
            src: "screenshot-narrow.png",
            sizes: "390x849",
            type: "image/png",
            form_factor: "narrow", // For mobile
          },
          // {
          //   src: "screenshot-default.png",
          //   sizes: "1080x1920",
          //   type: "image/png", // Default (mobile-compatible)
          // },
        ],
      },
      devOptions: {
        enabled: true, // Enables PWA in development mode for testing.
      },
    }),
  ],
});
