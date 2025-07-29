<template>
  <div
    v-if="autoScroll"
    @mouseenter="stopAutoScroll"
    @mouseleave="startAutoScroll"
    @pointerdown="stopAutoScroll"
    @pointerup="startAutoScroll"
  >
    <!-- Left Btn -->
    <button
      @click="scrollLeft"
      class="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-900/50 text-white p-2 rounded-full hover:bg-gray-900 transition hidden md:block hover:cursor-pointer"
    >
      <CircleChevronLeft :size="CAROUSEL_BUTTON_WIDTH" />
    </button>

    <!-- Right Btn  -->
    <button
      @click="scrollRight"
      class="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-900/50 text-white p-2 rounded-full hover:bg-gray-900 transition hidden md:block hover:cursor-pointer"
    >
      <CircleChevronRight :size="CAROUSEL_BUTTON_WIDTH" />
    </button>
    <div
      ref="carousel"
      class="flex overflow-x-auto py-4 scrollbar-hide scroll-smooth"
      @scroll="updateScrollState"
    >
      <slot></slot>
    </div>
  </div>
  <div v-else>
    <!-- Left Btn -->
    <button
      @click="scrollLeft"
      class="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-900/50 text-white p-2 rounded-full hover:bg-gray-900 transition hidden md:block hover:cursor-pointer"
    >
      <CircleChevronLeft :size="CAROUSEL_BUTTON_WIDTH" />
    </button>

    <!-- Right Btn  -->
    <button
      @click="scrollRight"
      class="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-900/50 text-white p-2 rounded-full hover:bg-gray-900 transition hidden md:block hover:cursor-pointer"
    >
      <CircleChevronRight :size="CAROUSEL_BUTTON_WIDTH" />
    </button>
    <div
      ref="carousel"
      class="flex overflow-x-auto py-4 scrollbar-hide scroll-smooth"
      @scroll="updateScrollState"
    >
      <slot :scrollContainer="carousel"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CircleChevronLeft, CircleChevronRight } from "lucide-vue-next";

const props = withDefaults(
  defineProps<{
    scrollTarget?: HTMLElement | null;
    scrollAmount?: number;
    interval?: number;
    autoScroll?: boolean;
    buttonWidth?: number;
  }>(),
  {
    scrollTarget: null,
    scrollAmount: 300,
    interval: 4000,
    autoScroll: false,
    buttonWidth: 48,
  }
);
const carousel = ref<HTMLElement | null>(null);
const scrollElement = computed(() => props.scrollTarget || carousel.value);
const SCROLL_AMOUNT = props.scrollAmount;
const SCROLL_INTERVAL = props.interval;
const CAROUSEL_BUTTON_WIDTH = props.buttonWidth;
let autoScrollTimer: NodeJS.Timeout;

const scrollLeft = () => {
  if (scrollElement.value) {
    scrollElement.value?.scrollBy({ left: -SCROLL_AMOUNT, behavior: "smooth" });
  }
};

const scrollRight = () => {
  if (!scrollElement.value) return;
  if (isAtEnd.value) {
    scrollElement.value.scrollTo({ left: 0, behavior: "smooth" });
  } else {
    scrollElement.value.scrollBy({ left: SCROLL_AMOUNT, behavior: "smooth" });
  }
};

const startAutoScroll = () => {
  clearInterval(autoScrollTimer);
  autoScrollTimer = setInterval(() => {
    scrollRight();
  }, SCROLL_INTERVAL);
};

const stopAutoScroll = () => {
  clearInterval(autoScrollTimer);
};

// Update scroll position and adjust for rounding issue
const isAtEnd = ref(false);
const updateScrollState = () => {
  if (!scrollElement.value) return;
  isAtEnd.value =
    scrollElement.value.scrollLeft + scrollElement.value.clientWidth >=
    scrollElement.value.scrollWidth - 10;
};

onMounted(() => {
  props.autoScroll && startAutoScroll();
  if (scrollElement.value) {
    scrollElement.value.addEventListener("scroll", updateScrollState);

    if (!props.autoScroll) return;

    scrollElement.value.addEventListener("touchstart", stopAutoScroll, {
      passive: true,
    });
    scrollElement.value.addEventListener("touchend", startAutoScroll, {
      passive: true,
    });
  }
});

onBeforeUnmount(() => {
  clearInterval(autoScrollTimer);
  if (!props.autoScroll) return;
  const el = carousel.value;
  if (!el) return;
  el.removeEventListener("touchstart", stopAutoScroll);
  el.removeEventListener("touchend", startAutoScroll);
});
</script>
