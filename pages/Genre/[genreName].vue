<template>
  <div class="bg-surface-dark pt-2">
    <div class="flex items-center justify-between px-6 mb-4">
      <h2
        class="text-white text-xl md:text-2xl font-semibold tracking-wide border-b border-primary pb-2 w-fit"
      >
        <span class="text-primary">🎬</span>
        <span class="ml-2"
          >{{ route.params.genreName }}
          {{ mediaType === "tv" ? "Tv shows" : "Movies" }}</span
        >
      </h2>
    </div>

    <div
      class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-items-center pt-4"
    >
      <NuxtLink
        v-for="media in genreMedia"
        :key="media.id"
        :to="`/${media.id}?from=/genre/${route.params.genreName}&mediaType=${media.media_type}`"
      >
        <BaseMovieCardSmall
          class="shrink-0 mx-2"
          :movieTitle="`${
            media.media_type === 'movie' ? media.title : media.name
          }`"
          :rating="media.vote_average"
          :releaseDate="`${
            media.media_type === 'movie'
              ? media.release_date
              : media.first_air_date
          }`"
          :posterUrl="media.poster_path"
        />
      </NuxtLink>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useInfiniteScroll } from "@vueuse/core";
import { useRoute } from "vue-router";
import { useMovieStore } from "~/store/store";

import type { Genre, MediaItem } from "@/types/types";

import BaseMovieCardSmall from "~/components/MovieSections/BaseMovieCardSmall.vue";
const movieStore = useMovieStore();
const route = useRoute();

const genres = ref<Genre[]>([]);

const genreMedia = ref<MediaItem[]>([]);
const page = ref(1);
const isLoading = ref(false);
const mediaType = route.query.mediaType;

async function fetchMediaByGenre() {
  if (isLoading.value || page.value > 500) return;

  isLoading.value = true;
  if (mediaType === "tv") {
    genres.value = movieStore.getTvGenres;
  } else {
    genres.value = movieStore.getMovieGenres;
  }
  const genre = genres.value.find((genre) => {
    return genre.name === route.params.genreName;
  });
  if (genre) {
    useHead({
      title: `${genre.name} ${mediaType === "tv" ? "Tv shows" : "Movies"}`,
    });
  }
  if (!genre) {
    console.error("Genre not found!");
    return;
  }

  let data = await $fetch<MediaItem[]>(
    `/api/MediaByGenre?genreId=${genre.id}&page=${page.value}`
  );
  genreMedia.value.push(...data);
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
definePageMeta({
  layout: "genre-pages",
});

onMounted(async () => {
  await fetchMediaByGenre();
});
</script>
