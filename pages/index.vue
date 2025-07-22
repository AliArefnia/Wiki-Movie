<template>
  <div>
    <Hero></Hero>
    <!-- <TrailerSection /> -->
    <GenreSection></GenreSection>
    <keep-alive>
      <BaseMovieSection
        v-for="genre in movieGenres"
        :key="genre.id"
        :genreId="genre.id"
        :genreName="genre.name"
        mediaType="movie"
      />
    </keep-alive>
    <keep-alive>
      <BaseMovieSection
        v-for="genre in tvGenres"
        :key="genre.id"
        :genreId="genre.id"
        :genreName="genre.name"
        mediaType="tv"
      />
    </keep-alive>
  </div>
</template>
<script setup lang="ts">
import BaseMovieSection from "~/components/MovieSections/BaseMovieSection.vue";

import { useMovieStore } from "~/store/store";
definePageMeta({
  layout: "default",
  pageTransition: {
    name: "page",
    mode: "out-in",
  },
});
useHead({
  title: "Home",
});

const movieStore = useMovieStore();

const movieGenres = computed(() => movieStore.movieGenres);
const tvGenres = computed(() => movieStore.tvGenres);
</script>
