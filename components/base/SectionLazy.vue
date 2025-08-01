<template>
  <div ref="el" :class="[height ? `min-h-[${height}px]` : 'min-h-[300px]']">
    <Transition name="fade" appear>
      <slot v-if="visible" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from "@vueuse/core";

const props = defineProps<{
  height?: string;
}>();

const el = ref(null);
const visible = ref(false);

const { stop } = useIntersectionObserver(el, ([entry]) => {
  if (entry.isIntersecting) {
    visible.value = true;
    stop();
  }
});
</script>
