<template>
  <div
    @mouseenter="stopAutoScroll"
    @mouseleave="startAutoScroll"
    @touchstart="stopAutoScroll"
    @touchend="startAutoScroll"
    class="relative px-0 md:px-8"
  >
    <!-- Left Btn -->
    <button
      @click="scrollLeft"
      class="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-900/50 text-white p-2 rounded-full hover:bg-gray-900 transition hidden md:block hover:cursor-pointer"
    >
      <CircleChevronLeft :size="48" />
    </button>

    <!-- Right Btn  -->
    <button
      @click="scrollRight"
      class="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-900/50 text-white p-2 rounded-full hover:bg-gray-900 transition hidden md:block hover:cursor-pointer"
    >
      <CircleChevronRight :size="48" />
    </button>

    <!-- Carousel -->
    <div
      ref="carousel"
      class="flex overflow-x-auto py-4 scrollbar-hide scroll-smooth"
      @scroll="updateScrollState"
    >
      <NuxtLink
        v-for="movie in HotMovies"
        :key="movie.id"
        :to="`/${movie.id}`"
        class="shrink-0 mx-2"
      >
        <BaseHeroCard
          :movieTitle="movie.title"
          :rating="movie.vote_average"
          :posterUrl="movie.poster_path"
        />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Movie } from "@/types/types";
import { CircleChevronLeft, CircleChevronRight } from "lucide-vue-next";

const HotMovies = ref<Movie[]>([]);
const carousel = ref<HTMLElement | null>(null);
const scrollAmount = 300;
const scrollInterval = 3000; // Auto-scroll every 3 seconds
let autoScrollTimer: NodeJS.Timeout;

const imageWidth = ref(0);

function getCardWidth() {
  const vw = window.innerWidth;
  if (vw >= 768) return 500;
  return 342;
}

const scrollLeft = () => {
  if (carousel.value) {
    carousel.value.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  }
};

const scrollRight = () => {
  if (!carousel.value) return;
  if (isAtEnd.value) {
    carousel.value.scrollTo({ left: 0, behavior: "smooth" });
  } else {
    carousel.value.scrollBy({ left: scrollAmount, behavior: "smooth" });
  }
};

const startAutoScroll = () => {
  autoScrollTimer = setInterval(() => {
    scrollRight();
  }, scrollInterval);
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

onMounted(async () => {
  imageWidth.value = getCardWidth();
  startAutoScroll();
  if (carousel.value) {
    carousel.value.addEventListener("scroll", updateScrollState);
  }

  try {
    if (sessionStorage.getItem("hotMovies")) {
      HotMovies.value = JSON.parse(sessionStorage.getItem("hotMovies")!);
      return;
    }

    const data = await $fetch<Movie[]>(
      `/api/MoviesHotData?width=${imageWidth.value}`
    );

    HotMovies.value = data;
    sessionStorage.setItem("hotMovies", JSON.stringify(data));
  } catch (error: unknown) {
    console.error("Error fetching data:", error);
  }
});
</script>
<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
