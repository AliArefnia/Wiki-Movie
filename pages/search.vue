<template>
  <div class="bg-surface-dark pt-2 min-h-screen">
    <div class="relative w-full max-w-md mx-auto px-4">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search movies..."
        class="w-full bg-surface-card pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-white mb-2 font-sans"
      />
      <div
        class="absolute left-7 bottom-1/5 -translate-y-1/2 text-gray-400 pointer-events-none"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 21l-4.35-4.35M16.65 16.65A7 7 0 1 0 3 10a7 7 0 0 0 13.65 6.65z"
          />
        </svg>
      </div>
    </div>

    <div
      v-if="searchMovie.length === 0 && !isLoading"
      class="text-gray-400 text-center font-display mt-6"
    >
      Sorry, couldn't find this movie!
    </div>
    <div v-else class="grid grid-cols-3 gap-2 justify-items-center pt-2">
      <NuxtLink
        v-for="movie in searchMovie"
        :key="movie.id"
        :to="`/${movie.id}?from=search`"
      >
        <BaseMovieCardSmall
          class="shrink-0 mx-2"
          :movieTitle="movie.title"
          :rating="movie.vote_average"
          :releaseDate="movie.release_date"
          :posterUrl="`${imageUrl}${movie.poster_path}`"
        />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Movie } from "~/types/types";
import { useInfiniteScroll, useDebounceFn } from "@vueuse/core";

const imageUrl = "https://image.tmdb.org/t/p/w154";
const searchMovie = ref<Movie[]>([]);
const page = ref(1);
const isLoading = ref(false);
const searchQuery = ref("");

const debouncedSearch = useDebounceFn(async () => {
  if (searchQuery.value.length > 2) {
    page.value = 1;
    searchMovie.value = [];
    await getMovieBySearch();
  } else {
    return;
  }
}, 400);

watch(searchQuery, debouncedSearch);

async function getHotNewMovies() {
  let data = await $fetch<Movie[]>("/api/MoviesHotData");
  searchMovie.value.push(...data);
}

async function getMovieBySearch() {
  if (page.value > 10 || searchQuery.value === "") return;
  try {
    isLoading.value = true;
    let data = await $fetch<Movie[]>(
      `/api/MovieBySearch?searchTerm=${searchQuery.value}&page=${page.value}`
    );
    searchMovie.value.push(...data);

    page.value++;
  } catch (error) {
    console.log("error fetching searched movie");
  } finally {
    isLoading.value = false;
  }
}

useInfiniteScroll(
  document,
  () => {
    if (!isLoading.value) {
      getMovieBySearch();
    }
  },
  { distance: 100 }
);

onMounted(async () => {
  await getHotNewMovies();
});
</script>
