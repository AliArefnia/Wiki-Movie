<template>
  <div class="flex justify-between items-center px-4 py-2 mt-4">
    <p class="text-white">Trailers</p>
  </div>
  <div class="flex overflow-auto">
    <BaseTrailerCard
      class="shrink-0 mx-2"
      v-for="movie in movies"
      :trailerUrl="`${movieTrailerUrl}${movie.officialTrailerKey}/videos`"
    />
  </div>
</template>
<script setup lang="ts">
import type { MovieWithTrailer, MovieListWithTrailer } from "@/types/types";

const movies = ref<MovieWithTrailer[]>([]);
const movieTrailerUrl = "https://www.youtube.com/embed/";
async function getMoviesWithTrailer() {
  const moviesWithTrailer = await $fetch<MovieListWithTrailer>(
    "/api/MovieTrailer"
  );
  movies.value = moviesWithTrailer.results;
}

onMounted(async () => {
  await getMoviesWithTrailer();
});
</script>
