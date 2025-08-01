<template>
  <div
    class="bg-gradient-to-br from-surface-dark to-primary text-white flex items-center justify-center rounded-lg shadow-md overflow-hidden min-w-[100px] sm:min-w-[120px] h-10 sm:h-12 hover:scale-105 hover:shadow-lg transition-transform duration-200 ease-in-out px-3 sm:px-4 whitespace-nowrap"
  >
    <p class="text-xs sm:text-sm font-semibold tracking-wide capitalize">
      {{ genreName }}
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  genreName: string;
}>();
</script>
