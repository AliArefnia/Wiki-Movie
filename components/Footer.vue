<template>
  <div
    class="flex justify-around bg-surface-card text-white shadow-lg sticky bottom-0 py-2 z-20"
  >
    <NuxtLink to="/"
      ><BaseButton><LayoutGrid /></BaseButton
    ></NuxtLink>
    <NuxtLink to="search">
      <BaseButton><Search /></BaseButton>
    </NuxtLink>
    <NuxtLink to="wishList">
      <BaseButton><Heart /></BaseButton>
    </NuxtLink>
    <NuxtLink to="user">
      <BaseButton><User /></BaseButton>
    </NuxtLink>
  </div>
</template>
<script setup>
import { LayoutGrid, Search, Heart, User } from "lucide-vue-next";
</script>
