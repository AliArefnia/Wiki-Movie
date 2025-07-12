<template>
  <BaseAlertModule :show="loggingOut" @close="logOut(false)">
    <template #header>Logging Out</template>
    <template #default>
      <p class="!text-xl">Are You sure you want to log out?</p>
    </template>
    <template #actions="{ close }">
      <BaseButton
        @click="
          close;
          logOut(true);
        "
        class="!bg-btn-accent w-[5rem] ml-2 text-white"
        >Yes</BaseButton
      >
      <BaseButton
        @click="
          close;
          logOut(false);
        "
        class="border-2 w-[5rem]"
        >No</BaseButton
      >
    </template>
  </BaseAlertModule>
  <div>
    <div
      class="max-w-3xl w-10/12 mt-8 mx-auto p-6 bg-surface-card text-white shadow-md rounded-lg text-center md:text-left"
    >
      <h1 class="text-2xl font-bold mb-4">User Profile</h1>
      <div class="space-y-4 mb-6">
        <div>
          <label class="block text-sm font-medium text-white">Name</label>
          <p class="text-lg text-gray-500">Set Name</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-white">Email</label>
          <p v-if="email" class="text-lg text-gray-500">{{ email }}</p>
          <p v-else class="text-lg text-gray-500">Set Email</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-white"
            >Favorite Movies</label
          >
          <p
            class="text-lg inline text-gray-500 hover:cursor-pointer hover:text-white hover: hover:animate-none animate-pulse"
            @click="router.push('/wishList')"
          >
            See Favorite Movies
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-white"
            >Joined Date</label
          >
          <p class="text-lg text-gray-500">{{ JoinDate }}</p>
        </div>
      </div>
      <div class="flex justify-around">
        <BaseButton varient="primary" class="flex-1 mx-3">
          Edit Profile
        </BaseButton>
        <BaseButton
          variant="danger"
          class="flex-1 mx-3 hover:bg-white hover:text-btn-accent"
          @click="logOutAlert"
          >Log Out</BaseButton
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
  title: "User",
});
import { useUserData } from "~/store/user";
import { useRouter } from "vue-router";
import BaseAlertModule from "~/components/base/BaseAlertModule.vue";
const userData = useUserData();
const email = computed(() => userData.userEmail);
const JoinDate = computed(() => {
  const date = userData.userJoinDate;
  return date ? new Date(date).toLocaleDateString() : "Unknown";
});
console.log(JoinDate);
const loggingOut = ref(false);

const router = useRouter();

function logOutAlert() {
  loggingOut.value = true;
}

function logOut(choice: boolean) {
  if (choice) {
    userData.logOut();
    router.push("/");
  } else {
    loggingOut.value = false;
  }
}
</script>
