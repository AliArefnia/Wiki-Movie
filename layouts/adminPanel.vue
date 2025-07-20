<template>
  <div class="min-h-screen bg-slate-900 text-white flex flex-col">
    <!-- Sidebar -->
    <AdminDashboardHeader></AdminDashboardHeader>
    <main class="bg-surface-dark flex-grow">
      <slot></slot>
    </main>
    <Footer role="admin" />
  </div>
</template>

<script setup lang="ts">
import AdminDashboardHeader from "~/components/AdminDashboardHeader.vue";
import Footer from "~/components/Footer.vue";
import { useUserData } from "~/store/user";

const userStore = useUserData();
console.log(userStore);
const role = computed(() => userStore.GetUserRole);
console.log(role.value);
</script>
