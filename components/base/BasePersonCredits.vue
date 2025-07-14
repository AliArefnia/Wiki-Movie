<template>
  <div class="mt-10">
    <h3 class="font-display mx-4 text-2xl">Person Credits</h3>
    <div class="flex py-4 w-full justify-around flex-wrap">
      <NuxtLink
        v-for="media in visibleMedia"
        :key="media.id"
        :to="`/${media.id}?mediaType=${media.media_type}`"
      >
        <BaseMovieCardSmall
          class="shrink-0 mx-2 my-2"
          :movieTitle="getTitle(media)"
          :rating="media.vote_average"
          :releaseDate="getReleaseDate(media)"
          :posterUrl="`https://image.tmdb.org/t/p/w${imageWidth}${media.poster_path}`"
        />
      </NuxtLink>
    </div>
    <div
      v-if="visibleCount < sortedMedia.length"
      class="flex justify-center mt-6"
    >
      <button
        class="px-6 py-2 bg-primary text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition duration-300 shadow-md hover:cursor-pointer animate-pulse"
        @click="loadMore"
      >
        <svg
          class="w-4 h-4 inline"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
        Show More
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import BaseMovieCardSmall from "~/components/MovieSections/BaseMovieCardSmall.vue";
import type { MediaItem, Movie, TvShow } from "@/types/types";

const props = defineProps<{
  media: (Movie | TvShow)[];
}>();

const imageWidth = ref(getImageWidth());

function getImageWidth() {
  const vw = window.innerWidth;
  if (vw >= 1280) return 500;
  if (vw >= 1024) return 342;
  if (vw >= 768) return 185;
  return 154;
}

const getTitle = (item: Movie | TvShow) =>
  item.media_type === "movie" ? item.title : item.name;

const getReleaseDate = (item: Movie | TvShow) =>
  item.media_type === "movie" ? item.release_date : item.first_air_date;

// Sort by date
const sortedMedia = computed(() => {
  return [...props.media].sort((a, b) => {
    const dateA = new Date(getReleaseDate(a)).getTime() || 0;
    const dateB = new Date(getReleaseDate(b)).getTime() || 0;
    return dateB - dateA; // latest first
  });
});
// Pagination logic
const visibleCount = ref(10);
const visibleMedia = computed(() =>
  sortedMedia.value.slice(0, visibleCount.value)
);
const loadMore = () => {
  visibleCount.value += 10;
};
</script>
