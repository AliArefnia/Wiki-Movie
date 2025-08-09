<template>
  <!-- Need to add dynamic font size for movie names -->
  <div
    class="relative rounded-2xl overflow-hidden font-sans h-fit hover:scale-105 hover:z-10 transition-transform flex w-fit"
  >
    <!-- Image Container -->
    <div
      class="relative aspect-[2/3] bg-gray-800 shrink-0"
      :style="{ width: cardWidth + 'px' }"
    >
      <!-- Actual Image -->
      <NuxtImg
        v-if="imageURL"
        class="w-full h-full object-cover transition-opacity duration-300"
        :src="imageURL"
        :alt="`${movieTitle} image`"
        @load="isImageLoaded = true"
        :class="{ 'opacity-0': !isImageLoaded, 'opacity-100': isImageLoaded }"
      />

      <!-- Skeleton while loading -->
      <div
        v-if="!isImageLoaded"
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
import moviePlaceholder from "/images/moviePlaceholder.png";

const props = defineProps<{
  movieTitle: string;
  releaseDate?: string;
  rating: number;
  posterUrl: string | null;
  description: string;
}>();

const imageURL = computed(() => {
  const width = imageWidth.value || 92;
  return props.posterUrl && props.posterUrl !== "null"
    ? `https://image.tmdb.org/t/p/w${width}${props.posterUrl}`
    : moviePlaceholder;
});

const imageWidth = ref(0);
const cardWidth = ref(92);
const isImageLoaded = ref(false);

function getCardWidth() {
  const vw = window.innerWidth;
  if (vw >= 768) return 154;
  return 110;
}
function getImgWidth() {
  const vw = window.innerWidth;
  return vw >= 768 ? 154 : 92;
}

function updateWidth() {
  imageWidth.value = getImgWidth();
  cardWidth.value = getCardWidth();
}

const debouncedUpdateWidth = useDebounceFn(updateWidth, 300);

onMounted(() => {
  updateWidth();
  window.addEventListener("resize", debouncedUpdateWidth);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", debouncedUpdateWidth);
});
</script>
