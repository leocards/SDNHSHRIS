import { useState, useEffect } from "react";

// Generic type T allows useDebounce to work with any type of value
function useDebounce<T>(value: T, delay: number): T {
	// State and setter for debounced value
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		// Set a timer to update the debounced value after the specified delay
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		// Cleanup the timer if the value changes or the component unmounts
		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]); // Re-run the effect only if value or delay changes

	return debouncedValue;
}

import { useCallback, useRef } from "react";

// Hook to debounce a function
function useDebouncedFunction<F extends (...args: any[]) => any>(func: F, delay: number): (...args: Parameters<F>) => void {
	const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

	// useCallback ensures the debounced function is stable across re-renders
	const debouncedFunction = useCallback((...args: Parameters<F>) => {
		// Clear the existing timer
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		// Set a new timer
		timeoutRef.current = setTimeout(() => {
			func(...args);
		}, delay);
	}, [func, delay]);

	// Cleanup the timer on unmount
	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return debouncedFunction;
}

export { useDebouncedFunction };


export default useDebounce;
