<template>
  <div>
    <Hero />
    <!-- <TrailerSection /> -->
    <GenreSection />
    <div v-if="movieGenres.length && tvGenres.length">
      <keep-alive>
        <SectionLazy v-for="genre in movieGenres" :key="'movie-' + genre.id">
          <BaseMovieSection
            :genreId="genre.id"
            :genreName="genre.name"
            mediaType="movie"
          />
        </SectionLazy>
      </keep-alive>

      <keep-alive>
        <SectionLazy v-for="genre in tvGenres" :key="'tv-' + genre.id">
          <BaseMovieSection
            :genreId="genre.id"
            :genreName="genre.name"
            mediaType="tv"
          />
        </SectionLazy>
      </keep-alive>
    </div>
  </div>
</template>
<script setup lang="ts">
import BaseMovieSection from "~/components/MovieSections/BaseMovieSection.vue";
import SectionLazy from "~/components/SectionLazy.vue";

import { useMovieStore } from "~/store/store";
import type { Genre } from "~/types/types";

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
