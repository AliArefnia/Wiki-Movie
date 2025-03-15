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
      :releaseData="movie.release_date"
      :posterUrl="`${imageUrl}${movie.poster_path}`"
    />
  </div>
</template>
<script setup>
import BaseMovieCardSmall from "@/components/base/BaseMovieCardsmall.vue";
import { useFormatNumber } from "@/composables/useFormatRatingNumber";

const { formatNumber } = useFormatNumber();

const imageUrl = ref("https://image.tmdb.org/t/p/w154");
const genreMovie = ref([]);
const props = defineProps({
  genreId: {
    type: Number,
    required: true,
  },
  genreName: {
    type: String,
    required: true,
  },
});

async function fetchMoviesByGenre(genreId) {
  const data = await $fetch(`/api/MoviesByGenre?genreId=${genreId}`);
  console.log(data.results);
  genreMovie.value = data.results.map((movie) => ({
    id: movie.id,
    title: movie.title,
    vote_average: formatNumber(movie.vote_average),
    poster_path: movie.poster_path,
    release_date: movie.release_date.split("-")[0],
  }));
}

onMounted(() => {
  console.log(props.genreId);
  fetchMoviesByGenre(props.genreId);
});
</script>
