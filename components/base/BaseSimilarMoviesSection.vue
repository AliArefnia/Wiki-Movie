<template>
  <div class="mt-10">
    <h3 class="font-display mx-4 text-2xl">Similar Movies</h3>
    <div class="flex overflow-auto py-4">
      <NuxtLink
        v-for="media in similarMedia"
        :key="media.id"
        :to="`/${media.id}`"
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
  </div>
</template>
<script setup lang="ts">
import BaseMovieCardSmall from "~/components/MovieSections/BaseMovieCardSmall.vue";
import type { MediaItem } from "@/types/types";

const similarMedia = ref<MediaItem[]>([]);
const props = defineProps<{
  movieId: number;
  mediaType: "tv" | "movie";
}>();
const imageWidth = ref(getImageWidth());

function getImageWidth() {
  const vw = window.innerWidth;
  if (vw >= 1280) return 500;
  if (vw >= 1024) return 342;
  if (vw >= 768) return 185;
  return 154;
}

async function fetchSimilarMedia(
  movieId: number,
  width: number,
  mediaType: "tv" | "movie"
) {
  let data = await $fetch<MediaItem[]>(
    `/api/MediaSimilarById?mediaId=${movieId}&mediaType=${mediaType}&width=${width}`
  );
  similarMedia.value = data;
}

const getTitle = (item: MediaItem) =>
  item.media_type === "movie" ? item.title : item.name;

const getReleaseDate = (item: MediaItem) =>
  item.media_type === "movie" ? item.release_date : item.first_air_date;

onMounted(async () => {
  try {
    await fetchSimilarMedia(props.movieId, imageWidth.value, props.mediaType);
  } catch (error) {
    console.error("Failed to fetch Similar movies:", error);
  }
});
</script>
