<template>
  <!-- Need to add dynamic font size for movie names -->
  <div
    class="relative rounded-2xl overflow-hidden font-sans h-fit hover:scale-105 hover:z-10 transition-transform flex w-fit"
  >
    <!-- Image Container -->
    <div
      class="relative aspect-[2/3] bg-gray-800 shrink-0 my-auto sm:my-0"
      :style="{ width: imageWidth + 'px' }"
    >
      <!-- Actual Image -->
      <NuxtImg
        v-if="posterUrl"
        class="w-full sm:h-full object-cover transition-opacity duration-300"
        :src="posterUrl"
        :alt="movieTitle"
        @load="loaded = true"
        :class="{ 'opacity-0': !loaded, 'opacity-100': loaded }"
      />

      <!-- Placeholder Image (fallback) -->
      <NuxtImg
        v-else
        src="/images/moviePlaceholder.png"
        alt="No Poster"
        class="w-full h-full object-cover"
      />

      <!-- Skeleton while loading -->
      <div
        v-if="!loaded"
        class="absolute inset-0 animate-pulse bg-gray-700"
      ></div>
    </div>

    <div
      class="flex flex-col left-4 bottom-4 text-white font-display grow px-2 py-4 sm:p-6"
    >
      <div class="flex flex-row justify-between items-center">
        <div class="font-bold line-clamp-3 text-xl lg:text-3xl my-1">
          {{ movieTitle }}
        </div>
        <div
          class="flex items-center text-[10px] sm:text-base bg-yellow-100/20 text-yellow-400 sm:px-3 rounded-2xl whitespace-nowrap h-fit sm:h-auto p-1"
        >
          {{ rating }}/10 ★
        </div>
      </div>

      <div class="font-mono w-fit text-md lg:text-xl mt-2">
        <div
          v-if="releaseDate"
          class="text-sm text-gray-300 px-3 py-1 bg-gray-700/40 rounded-full whitespace-nowrap"
        >
          {{ releaseDate }}
        </div>
      </div>
      <div class="text-lg mt-6 line-clamp-3 sm:line-clamp-4">
        {{ description }}
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
  description: string;
}>();

const imageWidth = ref(getCardWidth());
const loaded = ref(false);
const viewPortWidth = ref(window.innerWidth);

function getCardWidth() {
  const vw = window.innerWidth;
  if (vw >= 640) return 185;
  return 125;
}

function updateWidth() {
  imageWidth.value = getCardWidth();
  viewPortWidth.value = window.innerWidth;
}

onMounted(() => {
  window.addEventListener("resize", updateWidth);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateWidth);
});
</script>

<style scoped></style>
