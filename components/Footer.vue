<template>
  <div
    class="flex justify-around bg-surface-card text-white shadow-lg sticky bottom-0 py-2 z-20"
  >
    <NuxtLink to="/"
      ><BaseButton
        @click="footerTabSelected('home')"
        :class="{
          'bg-surface-hover text-primary': activeFooterTab === 'home',
          'text-white': !activeFooterTab === 'home',
        }"
        ><LayoutGrid /></BaseButton
    ></NuxtLink>
    <NuxtLink to="/search">
      <BaseButton
        @click="footerTabSelected('search')"
        :class="{
          'bg-surface-hover text-primary': activeFooterTab === 'search',
          'text-white': !activeFooterTab === 'search',
        }"
        ><Search
      /></BaseButton>
    </NuxtLink>
    <NuxtLink to="/wishList">
      <BaseButton
        @click="footerTabSelected('wishList')"
        :class="{
          'bg-surface-hover text-primary': activeFooterTab === 'wishList',
          'text-white': !activeFooterTab === 'wishList',
        }"
        ><Heart
      /></BaseButton>
    </NuxtLink>
    <NuxtLink to="/user">
      <BaseButton
        @click="footerTabSelected('user')"
        :class="{
          'bg-surface-hover text-primary': activeFooterTab === 'user',
          'text-white': !activeFooterTab === 'user',
        }"
        ><User
      /></BaseButton>
    </NuxtLink>
  </div>
</template>

<script setup>
import { LayoutGrid, Search, Heart, User } from "lucide-vue-next";
const activeFooterTab = ref("");

function footerTabSelected(tab) {
  console.log("Tab Selected:", tab); // Debugging the function call
  activeFooterTab.value = tab;
}
</script>
