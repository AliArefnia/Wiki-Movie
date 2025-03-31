<template>
  <div
    class="bg-surface-hover text-white flex items-center justify-center rounded-sm overflow-hidden w-[110px] h-[50px] hover:scale-110 transition-transform text-center p-1"
  >
    <p class="">{{ genreName }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  genreName: string;
}>();
</script>

<style scoped></style>
