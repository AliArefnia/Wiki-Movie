<template>
  <div>
    <div
      class="max-w-4xl w-10/12 mt-8 mx-auto p-6 bg-surface-card text-white shadow-md rounded-lg"
    >
      <h1 class="text-2xl font-bold mb-4">User Profile</h1>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-white">Name</label>
          <p class="text-lg text-gray-500">John Doe</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-white">Email</label>
          <p v-if="email" class="text-lg text-gray-500">{{ email }}</p>
          <p v-else class="text-lg text-gray-500">johndoe@example.com</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-white"
            >Favorite Movie</label
          >
          <p class="text-lg text-gray-500">Favorite Movie</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-white"
            >Joined Date</label
          >
          <p class="text-lg text-gray-500">Joined Date</p>
        </div>
      </div>
      <BaseButton varient="primary"> Edit Profile </BaseButton>
      <BaseButton variant="danger" full-width @click="logOut"
        >Log Out</BaseButton
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserData } from "~/store/user";
import { useRouter } from "vue-router";
const userData = useUserData();
const email = computed(() => userData.userEmail);

const router = useRouter();

function logOut() {
  userData.logOut();
  router.push("/");
}
</script>
