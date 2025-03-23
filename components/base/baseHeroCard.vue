<template>
  <div
    class="relative rounded-2xl overflow-hidden w-fit font-sans hover:scale-110 transition-transform"
  >
    <div class="absolute left-4 top-4">...</div>
    <NuxtImg
      :src="posterUrl"
      :alt="movieTitle"
      class="w-full h-auto object-cover"
    />
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  movieTitle: string;
  rating: number;
  posterUrl: string;
}>();
</script>
