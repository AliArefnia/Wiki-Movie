<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `Wiki Movie | ${titleChunk} ` : "Wiki Movie";
  },
  link: [{ rel: "icon", type: "image/png", href: "/Logo.png" }],
});
</script>
