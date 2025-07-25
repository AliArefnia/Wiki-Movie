<template>
  <div
    class="relative rounded-2xl overflow-hidden font-sans transition-transform"
    :style="{ width: imageWidth + 'px' }"
  >
    <div
      v-if="!isImageLoaded"
      class="absolute inset-0 bg-gray-700 animate-pulse"
      :style="{ height: imageHeight + 'px' }"
    ></div>
    <NuxtImg
      :src="posterUrl"
      :alt="movieTitle"
      :width="imageWidth"
      :height="imageHeight"
      sizes="(max-width: 768px) 185px, 342px"
      format="webp"
      class="w-full h-full object-cover transition-opacity duration-500"
      loading="lazy"
      @load="handleImageLoad"
      decoding="async"
      fetchpriority="high"
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

function updateDimensions() {
  const width = getCardWidth();
  imageWidth.value = width;
  imageHeight.value = Math.round(width * 1.5);
}

onMounted(() => {
  updateDimensions();
  window.addEventListener("resize", updateDimensions);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateDimensions);
});
</script>

<style scoped></style>
