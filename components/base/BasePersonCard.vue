<template>
  <div
    class="relative rounded-2xl overflow-hidden font-sans h-fit hover:scale-110 transition-transform"
    :style="{ width: imageWidth + 'px' }"
  >
    <div>
      <NuxtImg
        class="w-full h-auto object-cover"
        :src="computedProfileUrl"
        :alt="personName"
      />
    </div>
    <div class="text-white text-center p-2">
      <div class="font-bold text-sm line-clamp-2">{{ personName }}</div>
      <div class="text-[10px] text-gray-300">{{ role }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  personName: string;
  role: string;
  profileUrl: string | null;
}>();

const imageWidth = ref(getCardWidth());

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
</script>
