<template>
  <div class="flex flex-col items-center space-y-4 animate-fade-in">
    <svg
      class="w-12 h-12 text-white animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      ></path>
    </svg>
    <p class="text-lg font-semibold text-gray-300">
      {{ message }}
    </p>
  </div>
</template>
<script setup lang="ts">
defineProps({
  message: {
    type: String,
    default: "Loading...",
  },
});
</script>
