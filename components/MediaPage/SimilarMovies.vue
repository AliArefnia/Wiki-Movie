<template>
  <div class="mt-10">
    <h3 class="font-display mx-2 sm:mx-4 text-2xl">Similar Movies</h3>
    <div class="relative">
      <!-- Loading -->
      <div
        v-if="status === 'pending'"
        class="flex justify-center items-center mt-6"
      >
        <BaseLoader message="Fetching similar media..." />
      </div>

      <!-- Error -->
      <div v-else-if="error" class="flex justify-center items-center">
        <BaseErrorContainer :error="error" :refresh="refresh" />
      </div>

      <!-- Success -->
      <BaseCarousel
        v-else-if="similarMedia?.length"
        :scrollTarget="scrollTarget"
        :buttonWidth="32"
        left-button-placement="-left-5 top-1/2 -translate-y-11/12"
        right-button-placement="-right-5 top-1/2 -translate-y-11/12"
      >
        <BaseMediaScrollList
          ref="similarMediaRef"
          :items="similarMedia"
          :getItemKey="(item:any) => item.id"
          :getItemLink="(item:any) => `/${item.id}?mediaType=${item.media_type}`"
          @visibility-change="({ index }: any) => (showImage[index] = true)"
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

      <!-- Empty -->
      <p v-else class="text-gray-400 text-center font-display mt-6">
        No similar media found.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseMediaScrollList from "../base/BaseMediaScrollList.vue";
import type { MediaItem } from "@/types/types";

const props = defineProps<{
  movieId: number;
  mediaType: "tv" | "movie";
}>();

const similarMediaRef = ref<typeof BaseMediaScrollList | null>(null);
const showImage = ref<boolean[]>([]);
const scrollTarget = computed(() => similarMediaRef.value?.container ?? null);

const getTitle = (item: MediaItem) =>
  item.media_type === "movie" ? item.title : item.name;

const getReleaseDate = (item: MediaItem) =>
  item.media_type === "movie" ? item.release_date : item.first_air_date;

const {
  data: similarMedia,
  status,
  error,
  refresh,
} = useAsyncData<MediaItem[]>(
  `similar-media-${props.movieId}-${props.mediaType}`,
  () =>
    $fetch(
      `/api/MediaSimilarById?mediaId=${props.movieId}&mediaType=${props.mediaType}`
    ),
  {
    default: () => [],
  }
);
</script>
