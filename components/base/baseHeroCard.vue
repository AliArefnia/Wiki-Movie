<template>
  <div class="relative rounded-2xl overflow-hidden w-fit font-sans">
    <div class="absolute left-4 top-4">...</div>
    <div class="absolute flex flex-col left-4 bottom-4 text-white">
      <div>
        <span class="text-xl">{{ rating }}</span> / 10
      </div>
      <div>icon</div>
      <div class="text-2xl font-bold">{{ movieTitle }}</div>
    </div>
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
