<template>
  <div class="relative rounded-2xl overflow-hidden w-fit font-sans">
    <div class="absolute left-4 top-4">Trailer</div>
    <iframe
      width="200"
      height="112"
      :src="trailerUrl"
      frameborder="0"
      allowfullscreen
    ></iframe>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  trailerUrl: string;
}>();
</script>
