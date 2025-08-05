<template>
  <div
    class="relative rounded-2xl overflow-hidden font-sans transition-transform"
    :style="{ width: cardWidth + 'px' }"
  >
    <div
      v-if="!isImageLoaded"
      class="absolute inset-0 bg-gray-700 animate-pulse"
    ></div>
    <NuxtImg
      preload
      :src="imageURL"
      :alt="movieTitle"
      :width="imageWidth"
      :height="imageHeight"
      sizes="(max-width: 768px) 185px, 342px"
      format="webp"
      class="w-full h-full object-cover transition-opacity duration-500"
      @load="isImageLoaded = true"
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

const imageWidth = ref(0);
const cardWidth = ref(185);
const imageHeight = ref(0);
const isImageLoaded = ref(false);

const imageURL = computed(() => {
  const width = imageWidth.value || 185;
  return `https://image.tmdb.org/t/p/w${width}${props.posterUrl}`;
});

function getCardWidth() {
  const vw = window.innerWidth;
  return vw >= 768 ? 315 : 185;
}
function getImgWidth() {
  const vw = window.innerWidth;
  return vw >= 768 ? 342 : 185;
}

function updateDimensions() {
  const width = getImgWidth();
  imageWidth.value = width;
  cardWidth.value = getCardWidth();
}

onMounted(() => {
  updateDimensions();
  window.addEventListener("resize", updateDimensions);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateDimensions);
});
</script>
