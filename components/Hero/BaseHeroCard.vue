<template>
  <div
    class="relative rounded-2xl overflow-hidden font-sans transition-transform"
    :style="{ width: imageWidth + 'px' }"
  >
    <div class="absolute left-4 top-4">...</div>
    <!-- Skeleton loader -->
    <div
      v-if="!isImageLoaded"
      class="absolute inset-0 bg-gray-700 animate-pulse"
      :style="{ height: imageHeight + 'px' }"
    ></div>
    <NuxtImg
      :src="posterUrl"
      :alt="movieTitle"
      :style="{ height: imageHeight + 'px' }"
      class="w-full h-full object-cover transition-opacity duration-500"
      loading="lazy"
      @load="handleImageLoad"
    />
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  movieTitle: string;
  rating: number;
  posterUrl: string;
}>();

const imageWidth = ref(getCardWidth());
const imageHeight = ref(getCardHeight());
const isImageLoaded = ref(false);

function handleImageLoad() {
  isImageLoaded.value = true;
}

function getCardWidth() {
  const vw = window.innerWidth;
  return vw >= 768 ? 342 : 185;
}

function getCardHeight() {
  //  2:3
  return Math.round(getCardWidth() * 1.5);
}
</script>

<style scoped></style>
