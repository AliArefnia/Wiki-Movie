<template>
  <HeaderSection />
  <main class="bg-surface-dark min-h-[100vh]">
    <slot></slot>
  </main>
  <Footer />
</template>

<script setup>
import HeaderSection from "~/components/HeaderSection.vue";
import Footer from "~/components/Footer.vue";
</script>
