<template>
  <button :class="buttonClasses" :disabled="disabled">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  variant: {
    type: String,
    default: "primary",
  },
  size: {
    type: String,
    default: "md",
  },
  rounded: {
    type: Boolean,
    default: true,
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: false,
  },
});

const variantMap: Record<string, string> = {
  primary: "bg-btn-primary text-white hover:bg-btn-primary-hover ",
  secondary: "bg-btn-accent text-white hover:bg-gray-700",
  accent:
    "bg-btn-accent text-white hover:bg-primary hover:cursor-pointer hover:text-black  ",
  footer: "text-primary bg-transparent",
  danger: "bg-red-600 text-white hover:bg-red-700",
  diactivae: "bg-transparent text-gray-700 hover:bg-gray-100",
};

const sizeMap: Record<string, string> = {
  sm: "text-sm px-3 py-1.5",
  md: "text-base px-4 py-2",
  lg: "text-lg px-5 py-3",
};

const buttonClasses = computed(() => {
  return [
    "transition duration-300 font-medium focus:outline-none focus:ring-2 ease-in-out hover:shadow-lg hover:-translate-y-[1px] ",
    variantMap[props.variant] || variantMap.primary,
    sizeMap[props.size] || sizeMap.md,
    props.rounded ? "rounded-full" : "rounded-none",
    props.fullWidth ? "w-full" : "",
    props.active ? "bg-surface-hover text-primary" : "text-white",
    props.disabled
      ? "opacity-50 cursor-not-allowed pointer-events-none"
      : "cursor-pointer",
  ].join(" ");
});
</script>
