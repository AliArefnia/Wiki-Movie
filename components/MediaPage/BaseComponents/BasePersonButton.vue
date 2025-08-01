<template>
  <button @click="toggleFavouritePerson()">
    <UserMinus
      v-if="isFavouritePerson"
      class="hover:cursor-pointer hover:scale-105 hover:stroke-red-500 transition-all duration-300"
      color="red"
    ></UserMinus>
    <UserPlus
      v-else
      class="hover:cursor-pointer hover:scale-105 hover:stroke-red-500 transition-all duration-300"
    ></UserPlus>
  </button>
</template>

<script setup lang="ts">
import { UserMinus, UserPlus } from "lucide-vue-next";

const props = defineProps<{
  isFavouritePerson: boolean;
}>();

const emit = defineEmits<{
  (e: "toggleFavouritePerson"): void;
}>();

function toggleFavouritePerson() {
  emit("toggleFavouritePerson");
}
</script>
