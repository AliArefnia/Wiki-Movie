<template>
  <HeaderSectionGenrePage />
  <main class="bg-surface-dark min-h-[100vh]">
    <slot></slot>
  </main>
  <Footer />
</template>

<script setup>
import HeaderSectionGenrePage from "~/components/HeaderSectionGenrePage.vue";
import Footer from "~/components/Footer.vue";
</script>
