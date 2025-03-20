<template>
  <div class="flex justify-between items-center px-4 py-2 mt-2">
    <p class="text-white">{{ genreName }}</p>

    <NuxtLink
      class="text-primary bg-surface-card rounded-md p-2 cursor-pointer"
      :to="`/genre/${genreName}`"
      >more -></NuxtLink
    >
  </div>
  <div class="flex overflow-auto">
    <NuxtLink v-for="movie in genreMovie" :key="movie.id" :to="`/${movie.id}`">
      <BaseMovieCardSmall
        class="shrink-0 mx-2"
        :movieTitle="movie.title"
        :rating="movie.vote_average"
        :releaseDate="movie.release_date"
        :posterUrl="`${imageUrl}${movie.poster_path}`"
      />
    </NuxtLink>
  </div>
</template>
<script setup lang="ts">
import BaseMovieCardSmall from "~/components/base/BaseMovieCardSmall.vue";
import { useFormatNumber } from "~/composables/useFormatRatingNumber";
import type { Movie } from "@/types/types";

const { formatNumber } = useFormatNumber();

const imageUrl = "https://image.tmdb.org/t/p/w154";
const genreMovie = ref<Movie[]>([]);
const props = defineProps<{
  genreId: number;
  genreName: String;
}>();

async function fetchMoviesByGenre(genreId: number) {
  let data = await $fetch<Movie[]>(
    `/api/MoviesByGenre?genreId=${genreId}&page=1`
  );

  genreMovie.value = data.map((movie) => ({
    id: movie.id,
    title: movie.title,
    genre_ids: movie.genre_ids,
    vote_average: formatNumber(movie.vote_average),
    poster_path: movie.poster_path,
    release_date: movie.release_date.split("-")[0],
  }));
}

onMounted(async () => {
  try {
    await fetchMoviesByGenre(props.genreId);
  } catch (error) {
    console.error("Failed to fetch movies:", error);
  }
});
</script>
