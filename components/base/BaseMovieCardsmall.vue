<template>
  <!-- Need to add dynamic font size for movie names -->
  <div
    class="relative rounded-t-2xl overflow-hidden w-[100px] font-sans h-fit hover:scale-110 transition-transform"
  >
    <div>
      <NuxtImg
        class="w-full h-auto object-cover"
        :src="posterUrl"
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
        <span></span> <span>{{ releaseDate }}</span
        >-<span>{{ rating }}/10 </span><span class="text-yellow-500">★</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  movieTitle: string;
  releaseDate: string;
  rating: number;
  posterUrl: string;
}>();
</script>

<style scoped>
/* .dynamic-font-container {
  width: 100%;
  white-space: nowrap; /* Prevent text wrapping 
  /* font-size: 8px; */
/* font-size: clamp(8px, 48px); 
} */
</style>

<!-- <template>
  <div ref="dynamicText" class="dynamic-font-container">
    This is some dynamic text that will resize.
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const dynamicText = ref(null);

const resizeText = () => {
  const containerWidth = dynamicText.value.offsetWidth;
  const fontSize = Math.max(containerWidth / 10, 12); // Adjust scaling factor (10) as needed
  dynamicText.value.style.fontSize = `${fontSize}px`;
};

onMounted(() => {
  // Initialize font size on mount
  resizeText();

  // Observe container resize events
  const resizeObserver = new ResizeObserver(resizeText);
  resizeObserver.observe(dynamicText.value);
});
</script>

<style scoped>
.dynamic-font-container {
  width: 80%; /* Container width */
  max-width: 500px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style> -->
