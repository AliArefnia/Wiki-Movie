<template>
  <div class="min-h-screen flex flex-col">
    <Header class="flex" />
    <main class="bg-surface-dark flex-grow">
      <slot></slot>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Header from "~/components/Layout/Header.vue";
import Footer from "~/components/Layout/Footer.vue";
</script>
