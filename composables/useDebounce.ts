export function useDebounce(fn: () => void, delay: number = 300) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debouncedFn = () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn();
    }, delay);
  };

  return debouncedFn;
}
