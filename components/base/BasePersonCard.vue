<template>
  <div
    class="relative rounded-2xl overflow-hidden font-sans h-fit hover:scale-110 transition-transform"
    :style="{ width: imageWidth + 'px' }"
  >
    <div class="relative w-full" :style="{ height: imageHeight + 'px' }">
      <div
        v-if="!isImageLoaded"
        class="absolute inset-0 bg-gray-700 animate-pulse rounded-2xl"
      ></div>

      <NuxtImg
        :src="imageURL"
        :alt="personName"
        :width="imageWidth"
        :height="imageHeight"
        sizes="(max-width: 120px) 80px, 100px"
        :class="[
          'w-full h-full rounded-2xl transition-opacity duration-300',
          isImageLoaded ? 'opacity-100' : 'opacity-0',
        ]"
        @load="
          () => {
            isImageLoaded = true;
          }
        "
        loading="lazy"
        decoding="async"
      />
      <!-- Skeleton while loading -->
      <div
        v-if="!isImageLoaded"
        class="absolute inset-0 animate-pulse bg-gray-700"
      ></div>
    </div>
    <div class="text-white text-center p-2">
      <div class="font-bold text-sm line-clamp-2 lg:text-base">
        {{ personName }}
      </div>
      <div class="text-[10px] text-gray-300">{{ role }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";

const props = defineProps<{
  personName: string;
  role?: string;
  profileUrl: string | null;
}>();

const imageWidth = ref(0);
const imageHeight = ref(0);
const isImageLoaded = ref(false);

const imageURL = computed(() => {
  const width = imageWidth.value || 92;
  return props.profileUrl && props.profileUrl !== "null"
    ? `https://image.tmdb.org/t/p/w${width}${props.profileUrl}`
    : "images/personPlaceholder.png";
});

function getCardWidth() {
  const vw = window.innerWidth;
  if (vw >= 1280) return 92;
  // if (vw >= 1280) return 185;
  if (vw >= 768) return 92;
  // if (vw >= 768) return 154;
  return 92;
}

function updateDimensions() {
  const width = getCardWidth();
  imageWidth.value = width;
  imageHeight.value = Math.round(width * 1.5);
}
const debouncedUpdateDimensions = useDebounceFn(updateDimensions, 300);

onMounted(() => {
  updateDimensions();
  window.addEventListener("resize", debouncedUpdateDimensions);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", debouncedUpdateDimensions);
});
</script>
