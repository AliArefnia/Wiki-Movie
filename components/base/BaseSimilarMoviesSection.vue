<template>
  <div class="mt-10">
    <h3 class="font-display mx-4 text-2xl">Similar Movies</h3>
    <div class="flex overflow-auto py-4">
      <NuxtLink
        v-for="movie in similarMovies"
        :key="movie.id"
        :to="`/${movie.id}`"
      >
        <BaseMovieCardSmall
          class="shrink-0 mx-2"
          :movieTitle="movie.title"
          :rating="movie.vote_average"
          :releaseDate="movie.release_date"
          :posterUrl="movie.poster_path"
        />
      </NuxtLink>
    </div>
  </div>
</template>
<script setup lang="ts">
import BaseMovieCardSmall from "~/components/MovieSections/BaseMovieCardSmall.vue";
import { useFormatNumber } from "~/composables/useFormatRatingNumber";
import type { Movie } from "@/types/types";

const { formatNumber } = useFormatNumber();
const similarMovies = ref<Movie[]>([]);
const props = defineProps<{
  movieId: number;
}>();
const imageWidth = ref(getImageWidth());

function getImageWidth() {
  const vw = window.innerWidth;
  if (vw >= 1280) return 500;
  if (vw >= 1024) return 342;
  if (vw >= 768) return 185;
  return 154;
}

async function fetchSimilarMovies(movieId: number, width: number) {
  let data = await $fetch<Movie[]>(
    `/api/MovieSimilarById?movieId=${movieId}&width=${imageWidth.value}`
  );

  const clearedMovie = data.map((movie) => ({
    id: movie.id,
    title: movie.title,
    genre_ids: movie.genre_ids,
    vote_average: formatNumber(movie.vote_average),
    poster_path: movie.poster_path,
    release_date: movie.release_date.split("-")[0],
  }));
  similarMovies.value = clearedMovie;
}

onMounted(async () => {
  try {
    await fetchSimilarMovies(props.movieId, imageWidth.value);
  } catch (error) {
    console.error("Failed to fetch Similar movies:", error);
  }
});
</script>
