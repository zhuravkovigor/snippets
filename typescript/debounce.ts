function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null;

  return function (...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

export default debounce;

// Example usage of debounce function
const logMessage = (message: string) => {
  console.log(message);
};

const debouncedLogMessage = debounce(logMessage, 2000);
debouncedLogMessage("Hello, world!"); // This call will be debounced
