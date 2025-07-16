<template>
  <div class="flex justify-between items-center px-4 py-2 mt-2">
    <p class="text-white text-xl font-special">{{ genreName }}</p>

    <NuxtLink
      class="text-primary cursor-pointer group w-fit"
      :to="`/genre/${genreName}?mediaType=${mediaType}`"
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
    <NuxtLink
      v-for="media in genreMedia"
      :key="media.id"
      :to="`/${media.id}?mediaType=${media.media_type}`"
    >
      <BaseMovieCardSmall
        class="shrink-0 mx-2"
        :movieTitle="getTitle(media)"
        :rating="media.vote_average"
        :releaseDate="getReleaseDate(media)"
        :posterUrl="media.poster_path"
      />
    </NuxtLink>
  </div>
</template>
<script setup lang="ts">
import BaseMovieCardSmall from "~/components/MovieSections/BaseMovieCardSmall.vue";

import type { MediaItem } from "@/types/types";
import { ArrowRight } from "lucide-vue-next";

const genreMedia = ref<MediaItem[]>([]);
const props = defineProps<{
  genreId: number;
  genreName: String;
  mediaType: "movie" | "tv" | "all";
}>();

async function fetchMediaByGenre(genreId: number, mediaType: string) {
  const sessionGenreMediaKey = `Genre-${props.genreName}-${mediaType}`;
  if (sessionStorage.getItem(sessionGenreMediaKey)) {
    genreMedia.value = JSON.parse(
      sessionStorage.getItem(sessionGenreMediaKey)!
    );
    return;
  }

  let data = await $fetch<MediaItem[]>(
    `/api/MediaByGenre?genreId=${genreId}&mediaType=${
      props.mediaType || "all"
    }&page=1`
  );

  genreMedia.value = data;

  sessionStorage.setItem(sessionGenreMediaKey, JSON.stringify(data));
}

const getTitle = (item: MediaItem) =>
  item.media_type === "movie" ? item.title : item.name;

const getReleaseDate = (item: MediaItem) =>
  item.media_type === "movie" ? item.release_date : item.first_air_date;

onMounted(async () => {
  try {
    await fetchMediaByGenre(props.genreId, props.mediaType);
  } catch (error) {
    console.error("Failed to fetch movies:", error);
  }
});
</script>
