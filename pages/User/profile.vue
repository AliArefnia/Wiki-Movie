<template>
  <div>
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
            <div>
              <label class="block text-sm font-semibold mb-1">Name</label>
              <p v-if="!isEditing" class="text-lg text-gray-300 ml-2">
                {{ name || "Set Name" }}
              </p>
              <input
                v-else
                ref="nameInput"
                v-model="name"
                type="text"
                placeholder="Enter your name"
                class="w-full text-lg bg-transparent border-b p-2 border-gray-400 focus:border-white transition duration-300 text-gray-100 placeholder-gray-500 focus:border-2"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-white"
              >Joined Date</label
            >
            <p class="text-lg text-gray-500">{{ JoinDate }}</p>
            <!-- ACTION BUTTONS -->
            <div class="flex flex-col sm:flex-row gap-4 pt-6 mt-auto">
              <BaseButton
                @click="toggleEdit"
                varient="primary"
                class="flex-1 py-2 text-white"
                :disabled="isEditing && !name?.trim()"
              >
                {{ isEditing ? "Save" : "Edit Profile" }}
              </BaseButton>

              <BaseButton
                variant="danger"
                class="flex-1 py-2 hover:bg-white hover:text-btn-accent transition"
                @click="logOutAlert"
              >
                Log Out
              </BaseButton>
            </div>
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
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
  pageTransition: {
    name: "page",
    mode: "out-in",
  },
});
useHead({
  title: "User Profile",
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

const isEditing = ref(false);
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
function toggleEdit() {
  if (isEditing.value) {
    userData.updateUserName(name.value!);
  }
  isEditing.value = !isEditing.value;
}
</script>
