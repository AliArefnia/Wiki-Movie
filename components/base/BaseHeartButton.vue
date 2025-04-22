<template>
  <button @click="toggleMovieWishList()">
    <Heart
      :size="50"
      :class="[
        isInWishList ? 'fill-red-500' : 'fill-none stroke-gray-600',
        'transition-transform duration-300 ease-in-out',
        isInWishList ? 'scale-110 brightness-125' : 'scale-100 brightness-100',
        isInWishList ? 'animate-pulse' : '',
      ]"
      class=""
      color="red"
    />
  </button>
</template>

<script setup lang="ts">
import { Heart } from "lucide-vue-next";

const props = defineProps<{
  isInWishList: boolean;
}>();

const emit = defineEmits<{
  (e: "toggleMovieWishList"): void;
}>();

function toggleMovieWishList() {
  emit("toggleMovieWishList");
}
</script>
