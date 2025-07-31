<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `Wiki Movie | ${titleChunk} ` : "Wiki Movie";
  },
  link: [
    { rel: "icon", type: "image/webp", href: "/Logo.webp" },
    { rel: "apple-touch-icon", href: "/icons/web-app-manifest-192x192.png" },
    { rel: "manifest", href: "/manifest.webmanifest" },
    {
      rel: "preload",
      as: "font",
      href: "/fonts/oswald-v56-latin-regular.woff2",
      type: "font/woff2",
      crossorigin: "anonymous",
    },
    {
      rel: "preload",
      as: "font",
      href: "/fonts/oswald-v56-latin-700.woff2",
      type: "font/woff2",
      crossorigin: "anonymous",
    },
  ],
  meta: [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    {
      name: "description",
      content: "Discover and explore movies, TV shows, and actors.",
    },
    { name: "theme-color", content: "#1f2937" },
    { name: "apple-mobile-web-app-title", content: "Wiki Movie" },
    { name: "mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-status-bar-style", content: "#111827" },
  ],
});
</script>
