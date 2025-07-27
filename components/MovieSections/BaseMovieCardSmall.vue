<template>
  <!-- Need to add dynamic font size for movie names -->
  <div
    class="relative rounded-t-2xl overflow-hidden font-sans h-fit hover:scale-110 hover:z-10 transition-transform"
    :style="{ width: imageWidth + 'px' }"
  >
    <!-- Image Container -->
    <div class="relative aspect-[2/3] w-full bg-gray-800">
      <!-- Actual Image -->
      <NuxtImg
        v-if="posterUrl"
        :src="posterUrl"
        :alt="movieTitle"
        :width="imageWidth"
        sizes="(max-width: 150px) 125px, 100px"
        class="w-full h-full object-cover transition-opacity duration-300"
        @load="loaded = true"
        :class="{ 'opacity-0': !loaded, 'opacity-100': loaded }"
        loading="lazy"
        decoding="async"
      />

      <!-- Placeholder Image (fallback) -->
      <NuxtImg
        v-else
        src="/images/moviePlaceholder.png"
        alt="No Poster"
        class="w-full h-full"
        loading="lazy"
      />

      <!-- Skeleton while loading -->
      <div
        v-if="!loaded"
        class="absolute inset-0 animate-pulse bg-gray-700"
      ></div>
    </div>

    <div
      class="flex flex-col left-4 bottom-4 text-white font-display items-center"
    >
      <div
        class="w-full font-bold text-wrap line-clamp-2 text-center text-sm lg:text-base my-1"
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
const loaded = ref(false);

function getCardWidth() {
  const vw = window.innerWidth;
  if (vw >= 1280) return 150;
  if (vw >= 768) return 125;
  return 100;
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
