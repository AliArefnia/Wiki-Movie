<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useMovieStore } from "~/store/store";
import type { Genre } from "~/types/types";
const movieStore = useMovieStore();

onBeforeMount(async () => {
  const movieGenres = await $fetch<Genre[]>("/api/GetGenres?type=movie");
  movieStore.setMovieGenres(movieGenres);
  const tvGenres = await $fetch<Genre[]>("/api/GetGenres?type=tv");
  movieStore.setTvGenres(tvGenres);
});

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `Wiki Movie | ${titleChunk} ` : "Wiki Movie";
  },
  link: [{ rel: "icon", type: "image/png", href: "/Logo.png" }],
  meta: [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    {
      name: "description",
      content: "Discover and explore movies, TV shows, and actors.",
    },
  ],
});
</script>
