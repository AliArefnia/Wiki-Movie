<template>
  <div class="flex justify-between items-center px-4 py-2">
    <p class="text-white">{{ genreName }}</p>
    <BaseButton class="text-primary mt-2">more -></BaseButton>
  </div>
  <div class="flex overflow-auto">
    <BaseMovieCardSmall
      class="shrink-0 mx-2"
      v-for="movie in genreMovie"
      :key="movie.id"
      :movieTitle="movie.title"
      :rating="movie.vote_average"
      :releaseDate="movie.release_date"
      :posterUrl="`${imageUrl}${movie.poster_path}`"
    />
  </div>
</template>
<script setup lang="ts">
import BaseMovieCardSmall from "@/components/base/BaseMovieCardsmall.vue";
import { useFormatNumber } from "@/composables/useFormatRatingNumber";
import type { Movie, MoviesByGenre } from "@/types/types";
const { formatNumber } = useFormatNumber();

const imageUrl = "https://image.tmdb.org/t/p/w154";
const genreMovie = ref<Movie[]>([]);
const props = defineProps<{
  genreId: number;
  genreName: String;
}>();

async function fetchMoviesByGenre(genreId: number) {
  let data = await $fetch<Movie[]>(`/api/MoviesByGenre?genreId=${genreId}`);
  console.log(data);

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
    console.log(props.genreId);
    await fetchMoviesByGenre(props.genreId);
  } catch (error) {
    console.error("Failed to fetch movies:", error);
  }
});
</script>
