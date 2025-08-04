<template>
  <div>
    <div class="relative">
      <div class="flex justify-between items-center px-4 py-2 mt-2">
        <p class="text-white text-xl font-special">
          {{ genreName }}
        </p>

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
      <BaseCarousel :scrollTarget="scrollTarget" :buttonWidth="32">
        <BaseMediaScrollList
          ref="mediaListRef"
          :items="genreMedia"
          :cardWidth="cardWidth"
          :getItemKey="(item:any) => item.id"
          :getItemLink="(item:any) => `/${item.id}?mediaType=${item.media_type}`"
          @visibility-change="({ index }:any) => showImage[index] = true"
        >
          <template #card="{ item, index, visible }">
            <BaseMovieCardSmall
              v-if="visible"
              class="shrink-0 mx-2"
              :movieTitle="getTitle(item)"
              :rating="item.vote_average"
              :releaseDate="getReleaseDate(item)"
              :posterUrl="item.poster_path"
            />
          </template>
        </BaseMediaScrollList>
      </BaseCarousel>
    </div>
    <div v-if="topRated" class="w-11/12 my-6 mx-auto sm:w-3/4">
      <NuxtLink
        :key="topRated.id"
        :to="`/${topRated.id}?mediaType=${topRated.media_type}`"
      >
        <BaseTopRatedMovie
          class="bg-surface-card w-full"
          :movieTitle="getTitle(topRated)"
          :rating="topRated.vote_average"
          :releaseDate="getReleaseDate(topRated)"
          :posterUrl="topRated.poster_path"
          :description="topRated.overview"
      /></NuxtLink>
    </div>
  </div>
</template>
<script setup lang="ts">
import BaseMediaScrollList from "../base/BaseMediaScrollList.vue";
import BaseTopRatedMovie from "./BaseTopRatedMovie.vue";
import type { MediaItem } from "@/types/types";
import { ArrowRight } from "lucide-vue-next";

const showImage = ref<boolean[]>([]);
const observerElements = ref<(HTMLElement | null)[]>([]);

const mediaListRef = ref<typeof BaseMediaScrollList | null>(null);
const cardWidth = ref(90);

const scrollTarget = computed(() => mediaListRef.value?.container ?? null);

const props = defineProps<{
  genreId: number;
  genreName: String;
  mediaType: "movie" | "tv" | "all";
}>();

const topRated = ref<(MediaItem & { overview: string }) | null>(null);

const {
  data: genreMedia,
  status,
  error,
  refresh,
} = useAsyncData<MediaItem[]>(
  `genreMedia-${props.genreName}`,
  () =>
    $fetch(
      `/api/MediaByGenre?genreId=${props.genreId}&mediaType=${
        props.mediaType || "all"
      }&page=1`
    ),
  { default: () => [] }
);

watch(status, async (newStatus) => {
  if (newStatus === "success") {
    observerElements.value = [];
    await getTopRatedMovie(genreMedia.value);
  }
});

function getCardWidth() {
  const vw = window.innerWidth;
  if (vw >= 1024) return 160;
  if (vw >= 768) return 125;
  return 90;
}

function updateWidth() {
  cardWidth.value = getCardWidth();
}

const debouncedUpdateWidth = useDebounceFn(updateWidth, 300);

const getTitle = (item: MediaItem) =>
  item.media_type === "movie" ? item.title : item.name;

const getReleaseDate = (item: MediaItem) =>
  item.media_type === "movie" ? item.release_date : item.first_air_date;

async function getTopRatedMovie(mediaList: MediaItem[]) {
  let best: MediaItem | null = null;
  let bestRating = 8;

  for (const media of mediaList) {
    if (media.vote_average > bestRating) {
      best = media;
      bestRating = media.vote_average;
    } else if (media.vote_average === bestRating && best) {
      const dateA = new Date(getReleaseDate(media));
      const dateB = new Date(getReleaseDate(best));
      if (dateA > dateB) {
        best = media;
      }
    }
  }

  const bestData = best as MediaItem & { overview: string };

  topRated.value = bestData;
}

onMounted(async () => {
  updateWidth();
  window.addEventListener("resize", debouncedUpdateWidth);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", debouncedUpdateWidth);
});
</script>
