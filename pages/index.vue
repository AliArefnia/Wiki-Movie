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

const movieStore = useMovieStore();

const [movieGenres, tvGenres] = await Promise.all([
  $fetch<Genre[]>("/api/GetGenres?type=movie"),
  $fetch<Genre[]>("/api/GetGenres?type=tv"),
]);
movieStore.setMovieGenres(movieGenres);
movieStore.setTvGenres(tvGenres);

definePageMeta({
  layout: "default",
  pageTransition: {
    name: "page",
    mode: "out-in",
  },
});
useHead({
  title: "Home",
  meta: [
    {
      name: "description",
      content:
        "Watch details, trailers, and cast for Movie Title on Wiki Movie.",
    },
    {
      name: "keywords",
      content: "movies, trailers, actors, Movies",
    },
  ],
});
</script>
