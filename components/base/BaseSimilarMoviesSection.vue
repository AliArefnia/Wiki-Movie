<template>
  <div class="mt-10">
    <h3 class="font-display mx-4 text-2xl">Similar Movies</h3>
    <div class="relative">
      <BaseCarousel
        :scrollTarget="scrollTarget"
        :buttonWidth="32"
        left-button-placement="-left-5 top-1/2 -translate-y-11/12"
        right-button-placement="-right-5 top-1/2 -translate-y-11/12"
        v-if="similarMedia"
      >
        <BaseMediaScrollList
          ref="similarMediaRef"
          :items="similarMedia"
          :getItemKey="(item:any) => item.id"
          :getItemLink="(item:any) => `/${item.id}?mediaType=${item.media_type}`"
          @visibility-change="({ index }:any) => showImage[index] = true"
        >
          <template #card="{ item, index, visible }">
            <BaseMovieCardSmall
              v-if="visible"
              class="shrink-0"
              :movieTitle="getTitle(item)"
              :rating="item.vote_average"
              :releaseDate="getReleaseDate(item)"
              :posterUrl="item.poster_path"
            />
          </template>
        </BaseMediaScrollList>
      </BaseCarousel>
      <p v-else class="text-gray-400 text-center font-display mt-6">
        No Similar movie found
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import BaseMovieCardSmall from "~/components/MovieSections/BaseMovieCardSmall.vue";
import BaseCarousel from "./BaseCarousel.vue";
import BaseMediaScrollList from "./BaseMediaScrollList.vue";
import type { MediaItem } from "@/types/types";

const similarMedia = ref<MediaItem[]>([]);
const props = defineProps<{
  movieId: number;
  mediaType: "tv" | "movie";
}>();

const showImage = ref<boolean[]>([]);
const similarMediaRef = ref<typeof BaseMediaScrollList | null>(null);

const scrollTarget = computed(() => similarMediaRef.value?.container ?? null);

const imageWidth = ref(getImageWidth());

function getImageWidth() {
  const vw = window.innerWidth;
  if (vw >= 1280) return 500;
  if (vw >= 1024) return 342;
  if (vw >= 768) return 185;
  return 100;
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
