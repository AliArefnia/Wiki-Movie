<template>
  <div class="flex justify-between items-center px-4 py-2">
    <p class="text-white">Trailers</p>
  </div>
  <div class="flex overflow-auto">
    <BaseTrailerCard class="shrink-0 mx-2" v-for="n in 6" />
  </div>
</template>
<script setup></script>
