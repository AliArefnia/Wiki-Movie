<template>
  <div class="bg-surface-dark pt-2">
    <h3 class="text-white text-lg font-bold ml-6 mb-2">
      {{ route.params.genreName }} Movies
    </h3>

    <div class="grid grid-cols-3 gap-2 justify-items-center pt-2">
      <NuxtLink
        v-for="movie in genreMovie"
        :key="movie.id"
        :to="`/${movie.id}?from=/genre/${route.params.genreName}&mediaType=${movie.media_type}`"
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
definePageMeta({
  layout: "genre-pages",
});

import { useInfiniteScroll } from "@vueuse/core";
import { useRoute } from "vue-router";
import { useMovieStore } from "~/store/store";

import type { Movie } from "@/types/types";

import BaseMovieCardSmall from "~/components/MovieSections/BaseMovieCardSmall.vue";
const movieStore = useMovieStore();
const route = useRoute();

const genres = movieStore.movieGenres;

const genreMovie = ref<Movie[]>([]);
const page = ref(1);
const isLoading = ref(false);

async function fetchMediaByGenre() {
  if (isLoading.value || page.value > 500) return;

  isLoading.value = true;

  const genre = genres.find((genre) => {
    return genre.name === route.params.genreName;
  });

  if (!genre) {
    console.error("Genre not found!");
    return;
  }

  let data = await $fetch<Movie[]>(
    `/api/MediaByGenre?genreId=${genre.id}&page=${page.value}`
  );
  genreMovie.value.push(...data);
  page.value++;
  isLoading.value = false;
}

useInfiniteScroll(
  document,
  () => {
    if (!isLoading.value) {
      fetchMediaByGenre();
    }
  },
  { distance: 100 }
);

onMounted(async () => {
  await fetchMediaByGenre();
});
</script>
