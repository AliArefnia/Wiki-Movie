<template>
  <div
    class="bg-surface-hover text-white flex items-center justify-center rounded-md overflow-hidden min-w-[110px] h-12 hover:scale-105 transition-all duration-200 ease-in-out text-center px-3 whitespace-nowrap"
  >
    <p class="text-sm font-medium tracking-wide">{{ genreName }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  genreName: string;
}>();
</script>
