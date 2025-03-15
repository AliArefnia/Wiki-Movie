// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  runtimeConfig: {
    TMDB_API_KEY: process.env.TMDB_API_KEY, // Private key (server-side only)
    public: {
      TMDB_API_KEY: process.env.NUXT_PUBLIC_TMDB_API_KEY,
    },
  },

  css: ["@/assets/css/tailwind.css"],
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  vite: {
    plugins: [tailwindcss()],
  },
});
