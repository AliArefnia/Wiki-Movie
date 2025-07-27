import { ref, onMounted } from "vue";

export function useDisplayMode() {
  const isStandalone = ref(false);

  onMounted(() => {
    const isAndroidStandalone = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    const isIOSStandalone = (window.navigator as any).standalone === true;
    isStandalone.value = isAndroidStandalone || isIOSStandalone;
  });

  return { isStandalone };
}
