<template>
  <!-- Need to add dynamic font size for movie names -->
  <div class="relative rounded-t-2xl overflow-hidden w-[100px] font-sans">
    <div>
      <img class="" src="https://picsum.photos/100/125" alt="" />
    </div>
    <div class="flex flex-col left-4 bottom-4 text-white">
      <div class="dynamic-font-container font-bold tex">
        {{ movietitle }} red dead
      </div>

      <div class="text-[10px]">
        <span>icon</span> <span>{{ createdDate }}</span
        >-<span>{{ rating }}9/10 </span><span class="text-yellow-500">★</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  movietitle: {
    type: String,
    required: false,
  },
  createdDate: {
    type: Number,
    required: false,
  },
  rating: {
    type: Number,
    required: false,
    default: 0,
  },
});
</script>

<style scoped>
</style>
