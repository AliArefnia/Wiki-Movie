// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      TMDB_API_KEY: process.env.NUXT_PUBLIC_TMDB_API_KEY,
      SUPABASE_URL: process.env.NUXT_PUBLIC_SUPABASE_URL,
      SUPABASE_KEY: process.env.NUXT_PUBLIC_SUPABASE_KEY,
    },
  },
  plugins: ["~/plugins/supabase.ts"], // Register the plugin
  modules: ["@pinia/nuxt", "@vueuse/nuxt", "@nuxt/image"],
  css: ["@/assets/css/tailwind.css"],
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  vite: {
    plugins: [tailwindcss()],
  },
});
