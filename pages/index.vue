<template>
  <div id="mainPage">
    <Hero />
    <!-- <TrailerSection /> -->

    <!-- Loading -->
    <div v-if="status === 'pending'" class="flex justify-center items-center">
      <BaseLoader message="Fetching Genres..." />
    </div>
    <!-- Error -->
    <div v-else-if="error" class="flex justify-center items-center">
      <BaseErrorContainer :error="error" :refresh="refresh" />
    </div>
    <!-- Success -->
    <div v-else-if="movieGenres && tvGenres">
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
    <p v-else class="font-display mx-auto text-gray-400">No Genres Found</p>
  </div>
</template>

<script setup lang="ts">
import { useMovieStore } from "~/store/store";
import type { Genre } from "~/types/types";
import BaseMovieSection from "~/components/MovieSections/BaseMovieSection.vue";
import SectionLazy from "~/components/base/SectionLazy.vue";

const movieStore = useMovieStore();

const {
  data: movieGenres,
  status: statusMovies,
  error: errorMovies,
  refresh: refreshMovies,
} = await useAsyncData<Genre[]>("movieGenres", () =>
  $fetch("/api/GetGenres?type=movie")
);

const {
  data: tvGenres,
  status: statusTV,
  error: errorTV,
  refresh: refreshTV,
} = await useAsyncData<Genre[]>("tvGenres", () =>
  $fetch("/api/GetGenres?type=tv")
);

// Combine loading and error
const status = computed(() => statusMovies.value || statusTV.value);
const error = computed(() => errorMovies.value || errorTV.value);

if (!error.value && movieGenres.value && tvGenres.value) {
  movieStore.setMovieGenres(movieGenres.value);
  movieStore.setTvGenres(tvGenres.value);
}

function refresh() {
  refreshMovies();
  refreshTV();
}

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
