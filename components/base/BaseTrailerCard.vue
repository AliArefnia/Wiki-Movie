<template>
  <div>
    <p
      class="bg-black/50 text-white px-2 mx-4 py-1 rounded text-xs inline-block"
    >
      {{ props.trailerName }}
    </p>

    <div
      class="relative rounded-2xl overflow-hidden font-sans cursor-pointer flex justify-center"
      :class="{ 'w-full': props.soloMovie, 'w-fit': !props.soloMovie }"
      @click="showIframe = true"
    >
      <transition name="fade" mode="out-in">
        <img
          v-if="!showIframe"
          :src="thumbnailUrl"
          :width="trailerWidth"
          :height="trailerHeight"
          class="object-cover transition-opacity duration-500 rounded-2xl"
          alt="Trailer Thumbnail"
        />
        <iframe
          v-else
          :width="trailerWidth"
          :height="trailerHeight"
          :src="`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`"
          frameborder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
          class="transition-opacity duration-500 rounded-2xl"
        ></iframe>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  trailerUrl: string;
  soloMovie?: boolean;
  fallBackThumbnail?: string;
  trailerName?: string;
}>();

const showIframe = ref(false);
const trailerWidth = ref(200);
const trailerHeight = ref(112);

onMounted(() => {
  if (props.soloMovie) {
    trailerWidth.value = 400;
    trailerHeight.value = 224;
  }
});

const videoId = computed(() => {
  const match = props.trailerUrl.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  return match ? match[1] : "";
});
const thumbnailUrl = computed(() =>
  videoId.value
    ? `https://img.youtube.com/vi/${videoId.value}/maxresdefault.jpg`
    : props.fallBackThumbnail
);
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
