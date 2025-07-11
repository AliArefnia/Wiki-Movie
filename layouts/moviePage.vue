<template>
  <div class="min-h-screen flex flex-col">
    <HeaderSectionGenrePage />
    <main class="bg-surface-dark flex-grow relative">
      <slot></slot>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import HeaderSectionGenrePage from "~/components/HeaderSectionGenrePage.vue";
import Footer from "~/components/Footer.vue";
</script>
