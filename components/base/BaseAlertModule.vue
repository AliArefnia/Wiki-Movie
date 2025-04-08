<template>
  <teleport to="body">
    <div v-if="show" @click="tryClose" class="backdrop"></div>
    <transition name="dialog">
      <dialog open v-if="show" class="font-sans">
        <header class="bg-btn-accent text-lg">
          <slot name="header">
            <h2>{{ title }}</h2>
          </slot>
        </header>
        <section>
          <slot></slot>
        </section>
        <menu v-if="!fixed">
          <slot name="actions" :close="tryClose">
            <BaseButton @click="tryClose">Close</BaseButton>
          </slot>
        </menu>
      </dialog>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import BaseButton from "@/components/base/BaseButton.vue";

const props = defineProps<{
  show: Boolean;
  title?: String;
  fixed?: Boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

function tryClose() {
  if (props.fixed) {
    return;
  }
  emit("close");
}
</script>

<style scoped>
.dialog-enter-from,
.dialog-leave-to {
  opacity: 0.5;
  transform: scale(0.75);
}

.dialog-enter-active {
  transition: all 0.3s ease-out;
}
.dialog-leave-active {
  transition: all 0.3s ease-in;
}
.dialog-enter-to,
.dialog-leave-from {
  opacity: 1;
  transform: scale(1);
}

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 10;
}

dialog {
  position: fixed;
  top: 20vh;
  left: 10%;
  width: 80%;
  z-index: 100;
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  padding: 0;
  margin: 0;
  overflow: hidden;
  background-color: white;
}

header {
  color: white;
  width: 100%;
  padding: 1rem;
}

header h2 {
  margin: 0;
}

section {
  padding: 1rem;
}

menu {
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
  margin: 0;
}
</style>
