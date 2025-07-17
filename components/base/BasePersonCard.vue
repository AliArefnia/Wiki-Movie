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
        v-show="isImageLoaded"
        class="w-full h-full object-cover rounded-2xl transition-opacity duration-300"
        :src="computedProfileUrl"
        :alt="personName"
        @load="isImageLoaded = true"
      />
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
const props = defineProps<{
  personName: string;
  role?: string;
  profileUrl: string | null;
}>();

const imageWidth = ref(getCardWidth());
const imageHeight = ref(getCardHeight());
const isImageLoaded = ref(false);

const computedProfileUrl = computed(() => {
  return props.profileUrl &&
    props.profileUrl !== "null" &&
    !!props.profileUrl !== false
    ? `https://image.tmdb.org/t/p/w185${props.profileUrl}`
    : "images/personPlaceholder.png";
});

function getCardWidth() {
  const vw = window.innerWidth;
  if (vw >= 1280) return 120;
  if (vw >= 768) return 100;
  return 80;
}

function getCardHeight() {
  // 2:3
  return Math.round(getCardWidth() * 1.5);
}

function updateDimensions() {
  const width = getCardWidth();
  imageWidth.value = width;
  imageHeight.value = Math.round(width * 1.5);
}

onMounted(() => {
  window.addEventListener("resize", updateDimensions);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateDimensions);
});
</script>
