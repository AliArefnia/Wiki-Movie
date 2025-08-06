<template>
  <div class="bg-surface-dark pt-2 min-h-screen">
    <div class="sticky top-18 w-full max-w-md mx-auto px-4 z-20">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search movies..."
        class="w-full bg-surface-card pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-white mb-2 font-sans z-12"
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
      v-if="searchMovie.length === 0 && !isLoading && searchQuery.length !== 0"
      class="text-gray-400 text-center font-display mt-6"
    >
      Sorry, couldn't find this movie!
    </div>
    <div
      v-else
      class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-items-center pt-2"
    >
      <ClientOnly>
        <template v-for="item in searchMovie" :key="item.id">
          <NuxtLink
            v-if="item.media_type === 'movie' || item.media_type === 'tv'"
            :to="`/${item.id}?mediaType=${item.media_type}&from=search&searchTerm=${searchQuery}`"
          >
            <BaseMovieCardSmall
              class="shrink-0 mx-2"
              :movieTitle="item.media_type === 'movie' ? item.title : item.name"
              :rating="item.vote_average"
              :releaseDate="getReleaseDate(item)"
              :posterUrl="item.poster_path"
            />
          </NuxtLink>

          <NuxtLink
            v-else-if="item.media_type === 'person'"
            :to="`/${item.id}?mediaType=${item.media_type}&from=search&searchTerm=${searchQuery}`"
          >
            <BasePersonCard
              :personName="item.name"
              :role="item.known_for_department || 'Actor'"
              :profileUrl="item.profile_path"
            />
          </NuxtLink>
        </template>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
  pageTransition: {
    name: "page",
    mode: "out-in",
  },
});
useHead({
  title: "Search",
});

import BaseMovieCardSmall from "~/components/base/BaseMovieCardSmall.vue";
import type { SearchResult } from "~/types/types";
import { useInfiniteScroll, useDebounceFn } from "@vueuse/core";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const searchMovie = ref<SearchResult[]>([]);
const page = ref(0);
const isLoading = ref(false);
const searchQuery = ref((route.query.searchTerm as string) ?? "");

const {
  data: hotMedia,
  status,
  error,
  refresh,
} = useAsyncData(
  "Hot-media",
  () => $fetch<SearchResult[]>(`/api/HotMediaData`),
  { default: () => [] }
);

watch(searchQuery, (newVal) => {
  router.replace({
    query: {
      ...route.query,
      searchTerm: newVal || undefined,
    },
  });
});
const debouncedSearch = useDebounceFn(async () => {
  if (searchQuery.value.length > 2) {
    page.value = 1;
    searchMovie.value = [];
    await getMovieBySearch();
  } else {
    return;
  }
}, 400);

const executeSearch = async () => {
  console.log("execution");
  if (searchQuery.value.length > 2) {
    page.value = 1;
    searchMovie.value = [];
    await getMovieBySearch();
  }
};

watch(searchQuery, debouncedSearch);

async function getMovieBySearch() {
  if (page.value > 10 || searchQuery.value === "") return;
  try {
    isLoading.value = true;
    const encodedTerm = encodeURIComponent(searchQuery.value);
    let data = await $fetch<SearchResult[]>(
      `/api/MediaBySearch?searchTerm=${encodedTerm}&page=${page.value}`
    );

    const movieIds = new Set(searchMovie.value.map((m) => m.id));
    const newMovies = data.filter((m) => !movieIds.has(m.id));
    searchMovie.value.push(...newMovies);

    page.value++;
  } catch (error) {
    console.log("error fetching searched movie");
  } finally {
    isLoading.value = false;
  }
}

function getReleaseDate(item: SearchResult) {
  if (item.media_type === "movie") return item.release_date;
  if (item.media_type === "tv") return item.first_air_date;
  else return undefined;
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

onMounted(() => {
  searchMovie.value.push(...hotMedia.value);
  if (searchQuery.value) {
    executeSearch();
  }
});
</script>
