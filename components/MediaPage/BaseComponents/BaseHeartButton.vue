<template>
  <button @click="toggleMovieWishList()">
    <Heart
      :size="50"
      :class="[
        isInWishList
          ? 'fill-primary stroke-0'
          : 'fill-none stroke-gray-600 hover:stroke-primary',
        'transition-transform duration-300 ease-in-out',
        isInWishList
          ? 'scale-110 brightness-125 hover:scale-115'
          : 'scale-100 brightness-100 hover:scale-105',
        isInWishList ? 'animate-pulse' : '',
      ]"
      class="hover:cursor-pointer"
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
