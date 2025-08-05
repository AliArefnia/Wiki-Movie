<template>
  <div v-if="backdropUrl" class="absolute w-full overflow-hidden">
    <NuxtImg
      :src="backdropUrl"
      :alt="`${mediaName} image`"
      class="w-full h-full sm:h-auto object-cover"
      @load="isImageLoaded = true"
      format="webp"
      :class="{ 'opacity-0': !isImageLoaded, 'opacity-100': isImageLoaded }"
      decoding="async"
      fetchpriority="high"
    />
    <!-- overlay -->
    <div
      class="absolute bottom-0 left-0 w-full h-1/2 pointer-events-none"
      style="
        background: linear-gradient(
          to bottom,
          rgba(0, 0, 0, 0) 50%,
          rgba(17, 24, 39, 1) 100%
        );
      "
    ></div>
  </div>
</template>
<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";
const props = defineProps<{
  backdropPath: string;
  mediaName: string;
}>();

const imageWidth = ref(0);
const isImageLoaded = ref(false);

function getImgWidth() {
  const vw = window.innerWidth;
  if (vw >= 1024) return 1280;
  if (vw >= 780) return 780;
  return 500;
}

function updateWidth() {
  imageWidth.value = getImgWidth();
}

const debouncedUpdateWidth = useDebounceFn(updateWidth, 300);

const backdropUrl = computed(() => {
  if (props.backdropPath && imageWidth.value > 0) {
    return `https://image.tmdb.org/t/p/w${imageWidth.value}${props.backdropPath}`;
  }
  return null;
});

onMounted(() => {
  updateWidth();
  window.addEventListener("resize", debouncedUpdateWidth);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", debouncedUpdateWidth);
});
</script>
