export function useFormatNumber() {
  function formatNumber(num) {
    return Number.isInteger(num) ? num : parseFloat(num.toFixed(1));
  }

  return {
    formatNumber,
  };
}
