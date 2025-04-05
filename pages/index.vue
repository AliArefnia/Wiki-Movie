<template>
  <Hero></Hero>
  <!-- <TrailerSection /> -->
  <GenreSection></GenreSection>
  <keep-alive>
    <BaseMovieSection
      v-for="genre in genres"
      :key="genre.id"
      :genreId="genre.id"
      :genreName="genre.name"
    />
  </keep-alive>
</template>
<script setup lang="ts">

definePageMeta({
  layout: "default",
});

import { useMovieStore } from "~/store/store";

const movieStore = useMovieStore();
const genres = movieStore.movieGenres;

</script>
