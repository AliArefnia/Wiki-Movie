// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  css: ["@/assets/css/tailwind.css"],
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  vite: {
    plugins: [tailwindcss()],
  },
});
