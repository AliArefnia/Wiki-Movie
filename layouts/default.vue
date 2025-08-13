<template>
  <div class="min-h-screen flex flex-col">
    <Header class="flex" />
    <main class="bg-surface-dark flex-grow">
      <slot></slot>
    </main>
    <ClientOnly>
      <Footer v-if="width < breakpoint" />
    </ClientOnly>
  </div>
</template>

<script setup>
import Header from "~/components/Layout/Header.vue";
import Footer from "~/components/Layout/Footer.vue";

const width = ref(1024);
const breakpoint = 768;

function updateWidth() {
  width.value = window.innerWidth;
}

onMounted(() => {
  updateWidth();
  window.addEventListener("resize", updateWidth);
});
onUnmounted(() => {
  window.removeEventListener("resize", updateWidth);
});
</script>
