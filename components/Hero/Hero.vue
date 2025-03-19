<script setup lang="ts">
import type { Movie, TrendingMoviesResponse } from "@/types/types";

const HotMovies = ref<Movie[]>([]);
const imageUrl = "https://image.tmdb.org/t/p/w154";

onMounted(async () => {
  try {
    const data = await $fetch<Movie[]>("/api/MoviesHotData");
    console.log(data);
    HotMovies.value = data;
  } catch (error: unknown) {
    console.error("Error fetching data:", error);
  }
});
</script>

<template>
  <div class="flex overflow-auto">
    <BaseHeroCard
      class="shrink-0 mx-2"
      v-for="movie in HotMovies"
      :key="movie.id"
      :movieTitle="movie.title"
      :rating="movie.vote_average"
      :posterUrl="`${imageUrl}${movie.poster_path}`"
    ></BaseHeroCard>
  </div>
</template>
