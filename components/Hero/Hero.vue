<template>
  <div
    @mouseenter="stopAutoScroll"
    @mouseleave="startAutoScroll"
    @pointerdown="stopAutoScroll"
    @pointerup="startAutoScroll"
    class="relative px-0 md:px-8"
  >
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
      class="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-900/50 text-white p-2 rounded-full hover:bg-gray-900 transition hidden md:block hover:cursor-pointer"
    >
      <CircleChevronRight :size="CAROUSEL_BUTTON_WIDTH" />
    </button>

    <!-- Carousel -->
    <div
      ref="carousel"
      class="flex overflow-x-auto py-4 scrollbar-hide scroll-smooth"
      @scroll="updateScrollState"
    >
      <NuxtLink
        v-for="media in HotMedia"
        :key="media.id"
        :to="`/${media.id}?mediaType=${media.media_type}`"
        class="shrink-0 mx-2 group relative overflow-hidden rounded-xl"
      >
        <BaseHeroCard
          :movieTitle="getTitle(media)"
          :rating="media.vote_average"
          :posterUrl="media.poster_path || '/images/placeholder.png'"
          class="transform transition-transform duration-300 group-hover:scale-105 will-change-transform"
        />

        <!-- Rating badge on hover -->
        <div
          class="absolute top-2 right-2 bg-black/70 text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur"
        >
          ⭐ {{ media.vote_average.toFixed(1) }}
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseHeroCard from "./BaseHeroCard.vue";
import type { HotMedia } from "@/types/types";
import { CircleChevronLeft, CircleChevronRight } from "lucide-vue-next";

const HotMedia = ref<HotMedia[]>([]);
const carousel = ref<HTMLElement | null>(null);
const SCROLL_AMOUNT = 300;
const SCROLL_INTERVAL = 3000;
const CAROUSEL_BUTTON_WIDTH = 48;
let autoScrollTimer: NodeJS.Timeout;

const imageWidth = ref(0);

function getCardWidth() {
  const vw = window.innerWidth;
  return vw >= 768 ? 342 : 185;
}

function updateWidth() {
  imageWidth.value = getCardWidth();
}

onMounted(() => {
  window.addEventListener("resize", updateWidth);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateWidth);
});

const scrollLeft = () => {
  if (carousel.value) {
    carousel.value.scrollBy({ left: -SCROLL_AMOUNT, behavior: "smooth" });
  }
};

const scrollRight = () => {
  if (!carousel.value) return;
  if (isAtEnd.value) {
    carousel.value.scrollTo({ left: 0, behavior: "smooth" });
  } else {
    carousel.value.scrollBy({ left: SCROLL_AMOUNT, behavior: "smooth" });
  }
};

const startAutoScroll = () => {
  clearInterval(autoScrollTimer);
  autoScrollTimer = setInterval(() => {
    scrollRight();
  }, SCROLL_INTERVAL);
};

const stopAutoScroll = () => {
  clearInterval(autoScrollTimer);
};

// Update scroll position and adjust for rounding issue
const isAtEnd = ref(false);
const updateScrollState = () => {
  if (!carousel.value) return;
  isAtEnd.value =
    carousel.value.scrollLeft + carousel.value.clientWidth >=
    carousel.value.scrollWidth - 10;
};

const getTitle = (item: HotMedia) =>
  item.media_type === "movie" ? item.title : item.name;

async function fetchAndUpdate() {
  const data = await $fetch<HotMedia[]>(`/api/HotMediaData?...`);
  HotMedia.value = data;
  localStorage.setItem(
    "HotMedia",
    JSON.stringify({
      timestamp: Date.now(),
      data,
    })
  );
}

onMounted(async () => {
  imageWidth.value = getCardWidth();
  // add touchEnd and start
  startAutoScroll();
  if (carousel.value) {
    carousel.value.addEventListener("scroll", updateScrollState);

    carousel.value.addEventListener("touchstart", stopAutoScroll, {
      passive: true,
    });
    carousel.value.addEventListener("touchend", startAutoScroll, {
      passive: true,
    });
  }

  try {
    const cache = localStorage.getItem("HotMedia");
    if (cache) {
      const { timestamp, data } = JSON.parse(cache);
      const age = Date.now() - timestamp;
      const maxAge = 1000 * 60 * 60 * 2;

      if (age < maxAge) {
        HotMedia.value = data;
      } else {
        fetchAndUpdate();
      }
    } else {
      fetchAndUpdate();
    }

    const data = await $fetch<HotMedia[]>(
      `/api/HotMediaData?type=all&width=${imageWidth.value}`
    );

    HotMedia.value = data;
    sessionStorage.setItem("HotMedia", JSON.stringify(data));
  } catch (error: any) {
    console.error("Error fetching data:", error);
  }
});

onBeforeUnmount(() => {
  clearInterval(autoScrollTimer);
  const el = carousel.value;
  if (!el) return;

  el.removeEventListener("touchstart", stopAutoScroll);
  el.removeEventListener("touchend", startAutoScroll);
});
</script>
<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
