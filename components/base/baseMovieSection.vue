<template>
  <div class="flex justify-between items-center px-4 py-2">
    <p class="text-white">genres</p>
    <p class="text-white">more</p>
  </div>
  <div class="flex overflow-auto">
    <BaseMovieCardSmall class="shrink-0 mx-2" v-for="n in 6" />
  </div>
</template>
<script setup>
import BaseMovieCardSmall from "@/components/base/BaseMovieCardsmall.vue";
</script>
