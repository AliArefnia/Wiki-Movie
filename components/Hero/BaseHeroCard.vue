<template>
  <div
    class="relative rounded-2xl overflow-hidden font-sans transition-transform"
    :style="{ width: imageWidth + 'px' }"
  >
    <div class="absolute left-4 top-4">...</div>
    <NuxtImg
      :src="posterUrl"
      :alt="movieTitle"
      class="w-full h-auto object-cover"
      loading="lazy"
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

function getCardWidth() {
  const vw = window.innerWidth;
  if (vw >= 768) return 342;
  return 185;
}
</script>

<style scoped></style>
