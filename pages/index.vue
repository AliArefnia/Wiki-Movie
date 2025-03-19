<template>
  <Hero></Hero>
  <div class="text-white">{{ x }} , {{ y }}</div>
  <TrailerSection />
  <BaseMovieSection
    v-for="genre in genres"
    :genreId="genre.id"
    :genreName="genre.name"
  />
</template>
<script setup>
definePageMeta({
  layout: "default",
});

import { useMovieStore } from "~/store/store";

const movieStore = useMovieStore();

const genres = movieStore.movieGenres;
</script>
