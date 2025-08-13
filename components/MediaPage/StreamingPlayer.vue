<!-- components/MediaPage/StreamingPlayer.vue -->
<template>
  <div class="aspect-video">
    <iframe
      :src="`${streamBaseUrl}/${mediaType}/${mediaId}${extraPath}`"
      width="100%"
      height="100%"
      frameborder="0"
      allowfullscreen
    ></iframe>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  mediaId: number;
  mediaType: "movie" | "tv";
  season?: number;
  episode?: number;
}>();

const config = useRuntimeConfig();
const streamBaseUrl = config.public.STREAM_BASE_URL;

const extraPath = computed(() => {
  if (props.mediaType === "tv" && props.season && props.episode) {
    return `/${props.season}/${props.episode}`;
  }
  return "";
});
</script>
