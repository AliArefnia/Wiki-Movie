<template>
  <div>
    <div class="relative">
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
      <BaseMediaScrollList
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
    </div>
    <div v-if="topRated" class="w-11/12 my-6 mx-auto sm:w-3/4">
      <NuxtLink
        :key="topRated.id"
        :to="`/${topRated.id}?mediaType=${topRated.media_type}`"
      >
        <TopRatedMovie
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
import BaseMovieCardSmall from "~/components/MovieSections/BaseMovieCardSmall.vue";
import TopRatedMovie from "../TopRatedMovie.vue";
import BaseCarousel from "../base/BaseCarousel.vue";
import BaseMediaScrollList from "../base/BaseMediaScrollList.vue";
import type { MediaItem } from "@/types/types";
import { ArrowRight } from "lucide-vue-next";

const showImage = ref<boolean[]>([]);
const observerElements = ref<(HTMLElement | null)[]>([]);
const scrollContainer = ref<HTMLElement | null>(null);

const genreMedia = ref<MediaItem[]>([]);

const props = defineProps<{
  genreId: number;
  genreName: String;
  mediaType: "movie" | "tv" | "all";
}>();

const topRated = ref<(MediaItem & { overview: string }) | null>(null);

const imageQuality = ref(getImageQuality());
const cardWidth = ref(getCardWidth());

function getCardWidth() {
  const vw = window.innerWidth;
  if (vw >= 1200) return "150px";
  if (vw >= 768) return "130px";
  return "100px";
}

function updateCardWidth() {
  cardWidth.value = getCardWidth();
}

function getImageQuality() {
  const vw = window.innerWidth;
  if (vw >= 768) return 154;
  return 92;
}

async function fetchMediaByGenre(genreId: number, mediaType: string) {
  const sessionGenreMediaKey = `Genre-${props.genreName}-${mediaType}`;
  if (sessionStorage.getItem(sessionGenreMediaKey)) {
    genreMedia.value = JSON.parse(
      sessionStorage.getItem(sessionGenreMediaKey)!
    );
  } else {
    let data = await $fetch<MediaItem[]>(
      `/api/MediaByGenre?genreId=${genreId}&mediaType=${
        props.mediaType || "all"
      }&page=1&width=${imageQuality.value}`
    );
    genreMedia.value = data;
    sessionStorage.setItem(sessionGenreMediaKey, JSON.stringify(data));
    observerElements.value = [];
  }
  await getTopRatedMovie(genreMedia.value);
}

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
  try {
    getImageQuality();
    getCardWidth();
    await fetchMediaByGenre(props.genreId, props.mediaType);
    if (scrollContainer.value) {
      scrollContainer.value.scrollLeft = 0;
    }
    window.addEventListener("resize", updateCardWidth);
  } catch (error) {
    console.error("Failed to fetch movies:", error);
  }
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", updateCardWidth);
});
</script>
