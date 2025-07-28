<template>
  <div id="hero" class="relative px-0 md:px-8">
    <!-- Carousel -->

    <BaseCarousel :autoScroll="!!true">
      <NuxtLink
        v-for="media in HotMedia"
        :key="media.id"
        :to="`/${media.id}?mediaType=${media.media_type}`"
        class="shrink-0 mx-2 group relative overflow-hidden rounded-xl"
      >
        <BaseHeroCard
          id="herocard"
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
    </BaseCarousel>
  </div>
</template>

<script setup lang="ts">
import BaseHeroCard from "./BaseHeroCard.vue";
import BaseCarousel from "../base/BaseCarousel.vue";
import type { HotMedia } from "@/types/types";

const HotMedia = ref<HotMedia[]>([]);
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
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
