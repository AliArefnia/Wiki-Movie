<template>
  <div class="flex overflow-auto py-4">
    <NuxtLink
      v-for="movie in HotMovies"
      :key="movie.id"
      :to="`/${movie.id}`"
      class="shrink-0 mx-2"
    >
      <BaseHeroCard
        class="shrink-0 mx-2"
        :movieTitle="movie.title"
        :rating="movie.vote_average"
        :posterUrl="movie.poster_path"
      ></BaseHeroCard>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { Movie, TrendingMoviesResponse } from "@/types/types";

const HotMovies = ref<Movie[]>([]);

onMounted(async () => {
  try {
    if (sessionStorage.getItem("hotMovies")) {
      HotMovies.value = JSON.parse(sessionStorage.getItem("hotMovies")!);
      return;
    }

    const data = await $fetch<Movie[]>("/api/MoviesHotData");

    HotMovies.value = data;
    sessionStorage.setItem("hotMovies", JSON.stringify(data));
  } catch (error: unknown) {
    console.error("Error fetching data:", error);
  }
});
</script>
