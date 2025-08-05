<template>
  <div ref="container" class="flex overflow-auto py-4 whitespace-nowrap">
    <NuxtLink
      v-for="(item, index) in items"
      :key="getItemKey(item)"
      :to="getItemLink(item)"
    >
      <div
        :ref="(el) => setObserverRef(el, index)"
        class="inline-block flex-shrink-0 mx-2"
        :style="{ width: cardWidth + 'px' }"
      >
        <slot
          name="card"
          :item="item"
          :index="index"
          :visible="showImage[index]"
        />
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { ComponentPublicInstance } from "vue";
import { useIntersectionObserver } from "@vueuse/core";

const props = defineProps<{
  items: any[];
  cardWidth?: number;
  imageThreshold?: number;
  getItemKey?: (item: any) => string | number;
  getItemLink?: (item: any) => string;
}>();

const emit = defineEmits(["visibility-change"]);

const showImage = ref<boolean[]>([]);
const observerElements = ref<(HTMLElement | null)[]>([]);
const container = ref<HTMLElement | null>(null);

function setObserverRef(
  el: Element | ComponentPublicInstance | null,
  index: number
) {
  if (el instanceof HTMLElement) {
    observerElements.value[index] = el;
  } else {
    observerElements.value[index] = null;
  }
}

onMounted(() => {
  watch(
    () => props.items,
    async () => {
      showImage.value = new Array(props.items.length).fill(false);
      await nextTick();
      observeMediaCards();
    },
    { immediate: true }
  );
});

function observeMediaCards() {
  observerElements.value.forEach((el, index) => {
    if (!el || !(el instanceof HTMLElement)) return;

    const { stop } = useIntersectionObserver(
      el,
      ([entry]) => {
        if (entry.isIntersecting) {
          showImage.value[index] = true;
          emit("visibility-change", { index, item: props.items[index] });
          stop();
        }
      },
      {
        root: container.value,
        threshold: props.imageThreshold ?? 0.5,
      }
    );
  });
}

const getItemKey = props.getItemKey || ((item) => item.id);
const getItemLink = props.getItemLink || ((item) => `/` + item.id);

defineExpose({ container });
</script>
