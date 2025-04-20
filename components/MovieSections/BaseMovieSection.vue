<template>
  <div class="flex justify-between items-center px-4 py-2 mt-2">
    <p class="text-white text-xl font-special">{{ genreName }}</p>

    <NuxtLink
      class="text-primary cursor-pointer group w-fit"
      :to="`/genre/${genreName}`"
    >
      <div class="flex">
        <span class="mr-2 font-special text-sm">more</span>
        <span
          ><ArrowRight
            class="w-5 mr-2 -mt-0.5 group-hover:mr-0 group-hover:ml-2 transition-all"
        /></span>
      </div>
    </NuxtLink>
  </div>
  <div class="flex overflow-auto py-4">
    <NuxtLink v-for="movie in genreMovie" :key="movie.id" :to="`/${movie.id}`">
      <BaseMovieCardSmall
        class="shrink-0 mx-2"
        :movieTitle="movie.title"
        :rating="movie.vote_average"
        :releaseDate="movie.release_date"
        :posterUrl="movie.poster_path"
      />
    </NuxtLink>
  </div>
</template>
<script setup lang="ts">
import BaseMovieCardSmall from "~/components/MovieSections/BaseMovieCardSmall.vue";
import { useFormatNumber } from "~/composables/useFormatRatingNumber";
import type { Movie } from "@/types/types";
import { ArrowRight } from "lucide-vue-next";

const { formatNumber } = useFormatNumber();
const genreMovie = ref<Movie[]>([]);
const props = defineProps<{
  genreId: number;
  genreName: String;
}>();

async function fetchMoviesByGenre(genreId: number) {
  if (sessionStorage.getItem(`Genre-${props.genreName}-movies`)) {
    genreMovie.value = JSON.parse(
      sessionStorage.getItem(`Genre-${props.genreName}-movies`)!
    );
    return;
  }

  let data = await $fetch<Movie[]>(
    `/api/MoviesByGenre?genreId=${genreId}&page=1`
  );

  const clearedMovie = data.map((movie) => ({
    id: movie.id,
    title: movie.title,
    genre_ids: movie.genre_ids,
    vote_average: formatNumber(movie.vote_average),
    poster_path: movie.poster_path,
    release_date: movie.release_date.split("-")[0],
  }));
  genreMovie.value = clearedMovie;

  sessionStorage.setItem(
    `Genre-${props.genreName}-movies`,
    JSON.stringify(clearedMovie)
  );
}

onMounted(async () => {
  try {
    await fetchMoviesByGenre(props.genreId);
  } catch (error) {
    console.error("Failed to fetch movies:", error);
  }
});
</script>
