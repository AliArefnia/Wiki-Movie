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
      <!-- Left Btn -->
      <button
        @click="scrollLeft"
        class="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-900/50 text-white p-2 rounded-full hover:bg-gray-900 transition hidden md:block hover:cursor-pointer"
      >
        <CircleChevronLeft :size="CAROUSEL_BUTTON_WIDTH" />
      </button>

      <!-- Right Btn  -->
      <button
        @click="scrollRight"
        class="absolute top-1/2 right-2 transform -translate-y-1/2 z-10 bg-gray-900/50 text-white p-2 rounded-full hover:bg-gray-900 transition hidden md:block hover:cursor-pointer"
      >
        <CircleChevronRight :size="CAROUSEL_BUTTON_WIDTH" />
      </button>
      <!-- Carousel -->
      <div
        ref="scrollContainer"
        class="flex overflow-auto py-4 whitespace-nowrap"
      >
        <NuxtLink
          v-for="(media, i) in genreMedia"
          :key="media.id"
          :to="`/${media.id}?mediaType=${media.media_type}`"
        >
          <div
            :key="media.id"
            :ref="(el) => setObserverRef(el, i)"
            class="inline-block flex-shrink-0 mx-2"
            :style="{ width: cardWidth }"
          >
            <BaseMovieCardSmall
              v-if="showImage[i]"
              class="shrink-0 mx-2"
              :movieTitle="getTitle(media)"
              :rating="media.vote_average"
              :releaseDate="getReleaseDate(media)"
              :posterUrl="media.poster_path"
            />
          </div>
        </NuxtLink>
      </div>
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

import type { MediaItem } from "@/types/types";
import { ArrowRight } from "lucide-vue-next";

import { useIntersectionObserver } from "@vueuse/core";
import { CircleChevronLeft, CircleChevronRight } from "lucide-vue-next";

const SCROLL_AMOUNT = 300;
const CAROUSEL_BUTTON_WIDTH = 36;
const showImage = ref<boolean[]>([]);
const observerElements = ref<(HTMLElement | null)[]>([]);
const scrollContainer = ref<HTMLElement | null>(null);

// dynamic list
function setObserverRef(
  el: Element | ComponentPublicInstance | null,
  index: number
) {
  if (el instanceof HTMLElement) {
    observerElements.value[index] = el;
  } else {
    observerElements.value[index] = null;
  }
}

// Observer logic after cards are rendered
async function observeMediaCards() {
  await nextTick();

  if (!scrollContainer.value) return;
  const container = scrollContainer.value;

  observerElements.value.forEach((el, index) => {
    if (!el || !(el instanceof HTMLElement)) return;

    const { stop } = useIntersectionObserver(
      el,
      ([entry]) => {
        if (entry.isIntersecting) {
          showImage.value[index] = true;
          stop();
        }
      },
      {
        root: scrollContainer,
        threshold: 0.5, //  50%
      }
    );
  });
}

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
  showImage.value = new Array(genreMedia.value.length).fill(false);
  await getTopRatedMovie(genreMedia.value);
  await observeMediaCards(); // 👈 observe after loading
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

const scrollLeft = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({
      left: -SCROLL_AMOUNT,
      behavior: "smooth",
    });
  }
};

const scrollRight = () => {
  if (!scrollContainer.value) return;
  if (isAtEnd.value) {
    scrollContainer.value.scrollTo({ left: 0, behavior: "smooth" });
  } else {
    scrollContainer.value.scrollBy({ left: SCROLL_AMOUNT, behavior: "smooth" });
  }
};

const isAtEnd = ref(false);
const updateScrollState = () => {
  if (!scrollContainer.value) return;
  isAtEnd.value =
    scrollContainer.value.scrollLeft + scrollContainer.value.clientWidth >=
    scrollContainer.value.scrollWidth - 10;
};

onMounted(async () => {
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener("scroll", updateScrollState);
  }
  try {
    getImageQuality();
    getCardWidth();
    await fetchMediaByGenre(props.genreId, props.mediaType);
    if (scrollContainer.value) {
      scrollContainer.value.scrollLeft = 0;
    }
    await observeMediaCards();
    window.addEventListener("resize", updateCardWidth);
  } catch (error) {
    console.error("Failed to fetch movies:", error);
  }
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", updateCardWidth);
});
</script>
