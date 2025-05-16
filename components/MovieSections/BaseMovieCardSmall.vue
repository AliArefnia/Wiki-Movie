<template>
  <!-- Need to add dynamic font size for movie names -->
  <div
    class="relative rounded-t-2xl overflow-hidden font-sans h-fit hover:scale-110 transition-transform"
    :style="{ width: imageWidth + 'px' }"
  >
    <div>
      <NuxtImg
        class="w-full h-auto object-cover"
        :src="posterUrl ? posterUrl : '/images/moviePlaceholder.png'"
        :alt="movieTitle"
      />
    </div>
    <div
      class="flex flex-col left-4 bottom-4 text-white font-display items-center"
    >
      <div
        class="dynamic-font-container font-bold line-clamp-2 text-center text-sm my-1"
      >
        {{ movieTitle }}
      </div>

      <div class="text-[10px] font-mono w-fit">
        <span v-if="releaseDate">{{ releaseDate }}</span
        >-<span>{{ rating }}/10 </span><span class="text-yellow-500">★</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  movieTitle: string;
  releaseDate?: string;
  rating: number;
  posterUrl: string | null;
}>();

const imageWidth = ref(getCardWidth());

function getCardWidth() {
  const vw = window.innerWidth;
  if (vw >= 1280) return 150;
  if (vw >= 768) return 125;
  return 100;
}
</script>

<style scoped></style>
