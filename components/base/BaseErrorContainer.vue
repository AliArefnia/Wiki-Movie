<template>
  <div
    class="mx-auto mt-6 max-w-md rounded-md border border-primary p-4 text-primary shadow-sm bg-surface-card"
  >
    <div class="flex items-center justify-between">
      <p class="font-semibold text-white">Something went wrong</p>
      <BaseButton @click="refresh" variant="accent" size="sm" class="ml-3">
        Try Again
      </BaseButton>
    </div>
    <p class="mt-2 text-sm italic">
      {{ error?.message || "Unknown error occurred." }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  error: Error | null;
  refresh: () => void;
}>();
</script>
