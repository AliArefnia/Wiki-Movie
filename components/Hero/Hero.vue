<template>
  <div id="hero" class="min-h-[318px] relative px-0 md:px-8">
    <div
      v-if="status === 'pending'"
      class="min-h-[318px] flex justify-center items-center"
    >
      <BaseLoader message="Getting Hot Movies..." />
    </div>

    <div
      v-else-if="error"
      class="min-h-[318px] flex justify-center items-center"
    >
      <BaseErrorContainer :error="error" :refresh="refresh" />
    </div>

    <BaseCarousel v-else :autoScroll="true">
      <NuxtLink
        v-for="media in hotMedia"
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
import BaseHeroCard from "@/components/Hero/BaseHeroCard.vue";
import BaseCarousel from "@/components/base/BaseCarousel.vue";
import BaseLoader from "@/components/base/BaseLoader.vue";
import BaseErrorContainer from "../base/BaseErrorContainer.vue";
import type { HotMedia } from "@/types/types";

function getTitle(item: HotMedia) {
  return item.media_type === "movie" ? item.title : item.name;
}

const {
  data: hotMedia,
  status,
  error,
  refresh,
} = useAsyncData<HotMedia[]>(
  "hot-media-fetch",
  () => $fetch("/api/HotMediaData?type=all"),
  {
    default: () => [],
  }
);
</script>
