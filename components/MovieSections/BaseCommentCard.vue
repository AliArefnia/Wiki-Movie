<template>
  <div
    class="bg-surface-card text-white rounded-xl p-4 shadow-md border border-surface-hover transition hover:shadow-lg"
  >
    <p class="text-xs text-gray-400 mb-1">
      {{ comment.user?.name || "USER" }}
    </p>
    <p class="mb-2 text-sm leading-relaxed text-gray-100">
      {{ comment.comment }}
    </p>
    <p class="text-xs text-gray-400">
      {{ formatDate(comment.created_at) }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Comments } from "~/types/types";

const props = defineProps<{
  comment: Comments;
}>();

function formatDate(isoDate: string) {
  const date = new Date(isoDate);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
</script>
