<template>
  <button @click="toggleMovieWatched()">
    <Eye
      v-if="isWatched"
      class="hover:cursor-pointer hover:scale-105 hover:stroke-red-500"
      color="red"
    ></Eye>
    <EyeClosed
      v-else
      class="hover:cursor-pointer hover:scale-105 hover:stroke-red-500"
    ></EyeClosed>
  </button>
</template>

<script setup lang="ts">
import { Eye } from "lucide-vue-next";
import { EyeClosed } from "lucide-vue-next";

const props = defineProps<{
  isWatched: boolean;
}>();

const emit = defineEmits<{
  (e: "toggleMovieWatched"): void;
}>();

function toggleMovieWatched() {
  emit("toggleMovieWatched");
}
</script>
