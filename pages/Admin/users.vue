<template>
  <div class="px-4">
    <h1 class="text-white text-2xl font-bold ml-5 mb-4 pt-5 font-display">
      User Management
    </h1>
    <AdminTable
      title="Moderate Users"
      :headers="headers"
      endpoint="/api/admin/getUsers"
      delete-endpoint="/api/admin/deleteUser"
      user-delete-mode
    />
  </div>
</template>

<script setup lang="ts">
import AdminTable from "~/components/Admin/AdminTable.vue";

const headers = [
  { text: "Name", value: "name" },
  { text: "Email", value: "email" },
  { text: "Created At", value: "created_at" },
  { text: "Operations", value: "operation", fixed: true },
];
</script>
