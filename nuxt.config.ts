import type { RouteMatchCallbackOptions } from "workbox-core";
import { visualizer } from "rollup-plugin-visualizer";

import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig(<any>{
  nitro: {
    preset: process.env.VERCEL ? "vercel" : "node-server",
  },
  devServer: {
    port: process.env.PORT || 3000,
    host: "0.0.0.0",
  },
  runtimeConfig: {
    public: {
      STREAM_BASE_URL: process.env.NUXT_PUBLIC_STREAM_BASE_URL || "",
      TMDB_API_KEY: process.env.NUXT_PUBLIC_TMDB_API_KEY,
      SUPABASE_URL: process.env.NUXT_PUBLIC_SUPABASE_URL,
      SUPABASE_KEY: process.env.NUXT_PUBLIC_SUPABASE_KEY,
    },
  },
  app: {
    layoutTransition: {
      name: "layout",
      mode: "out-in",
    },
  },
  plugins: ["~/plugins/supabase.ts", "~/plugins/vue-toastification.ts"],
  modules: ["@pinia/nuxt", "@vueuse/nuxt", "@nuxt/image", "@vite-pwa/nuxt"],
  image: {
    provider: "ipx",
    dir: "public",
  },
  css: ["@/assets/css/tailwind.css"],
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true, timeline: { enabled: true } },
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        plugins: [
          visualizer({
            filename: "./dist/stats.html",
            open: true,
            template: "treemap",
            gzipSize: true,
            brotliSize: true,
          }),
        ],
      },
    },
  },
  pwa: {
    registerType: "autoUpdate",
    includeAssets: ["favicon.ico", "apple-touch-icon.png", "icons/*.png"],
    manifest: {
      id: "/",
      name: "Wiki Movie",
      short_name: "Wiki Movie",
      description: "Explore and discover movies, shows, and people.",
      theme_color: "#1f2937",
      background_color: "#1f2937",
      display: "standalone",
      start_url: "/",
      lang: "en",
      icons: [
        {
          src: "/icons/web-app-manifest-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/icons/web-app-manifest-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "/icons/web-app-manifest-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
      screenshots: [
        {
          src: "/screenshots/homepage.png",
          sizes: "1365x643",
          type: "image/png",
          form_factor: "wide",
        },
        {
          src: "/screenshots/mobileview.png",
          sizes: "360x640",
          type: "image/png",
          form_factor: "narrow",
        },
      ],
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      runtimeCaching: [
        {
          urlPattern: ({ url }: RouteMatchCallbackOptions) =>
            url.origin === "https://image.tmdb.org",
          handler: "CacheFirst",
          options: {
            cacheName: "tmdb-images",
            expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 },
          },
        },
        {
          urlPattern: ({ url }: RouteMatchCallbackOptions) =>
            url.origin === self.location.origin,
          handler: "NetworkFirst",
          options: {
            cacheName: "app-pages",
          },
        },
      ],
    },
  },
});
