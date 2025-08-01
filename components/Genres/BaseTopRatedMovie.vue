<template>
  <!-- Need to add dynamic font size for movie names -->
  <div
    class="relative rounded-2xl overflow-hidden font-sans h-fit hover:scale-105 hover:z-10 transition-transform flex w-fit"
  >
    <!-- Image Container -->
    <div
      class="relative aspect-[2/3] bg-gray-800 shrink-0"
      :style="{ width: imageWidth + 'px' }"
    >
      <!-- Actual Image -->
      <NuxtImg
        v-if="posterUrl"
        class="w-full h-full object-cover transition-opacity duration-300"
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
        loading="lazy"
      />

      <!-- Skeleton while loading -->
      <div
        v-if="!loaded"
        class="absolute inset-0 animate-pulse bg-gray-700"
      ></div>
    </div>

    <!-- info -->
    <div
      class="flex flex-col left-4 bottom-4 text-white font-display grow p-2 sm:p-6"
    >
      <div
        class="font-bold line-clamp-2 sm:line-clamp-none text-md sm:text-2xl my-1"
      >
        {{ movieTitle }}
      </div>

      <div class="my-2 flex flex-row gap-2">
        <div
          v-if="releaseDate || rating"
          class="text-[11px] sm:text-base text-gray-300 px-3 py-1 bg-gray-700/40 rounded-full whitespace-nowrap"
        >
          {{ releaseDate }}
        </div>
        <div
          class="flex items-center text-[11px] sm:text-base bg-yellow-100/20 text-yellow-400 sm:px-3 rounded-2xl whitespace-nowrap p-1"
        >
          {{ rating }}/10 ★
        </div>
      </div>
      <div
        class="text-xs sm:text-base md:text-lg my-auto line-clamp-3 sm:line-clamp-4 font-sans leading-5 sm:leading-normal"
      >
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

const imageWidth = ref(0);
const loaded = ref(false);

function getCardWidth() {
  const vw = window.innerWidth;
  if (vw >= 640) return 185;
  return 125;
}

function updateWidth() {
  imageWidth.value = getCardWidth();
}

onMounted(() => {
  updateWidth();
  window.addEventListener("resize", updateWidth);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateWidth);
});
</script>

<style scoped></style>
