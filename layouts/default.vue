<template>
  <div class="min-h-screen flex flex-col">
    <HeaderSection class="flex" />
    <main class="bg-surface-dark flex-grow">
      <slot></slot>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import HeaderSection from "~/components/HeaderSection.vue";
import Footer from "~/components/Footer.vue";

useHead({
  link: [
    {
      rel: "preload",
      as: "font",
      href: "/fonts/inter-v19-latin-regular.woff2",
      type: "font/woff2",
      crossorigin: "anonymous",
    },
  ],
});
</script>
