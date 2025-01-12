import { useRef, useCallback } from "react";

function useThrottle<T extends (...args: any[]) => any>(
	callback: T,
	delay: number
) {
	const lastCall = useRef(0);
	const savedCallback = useRef(callback);

	// Update saved callback if it changes
	useCallback(() => {
		savedCallback.current = callback;
	}, [callback]);

	return useCallback(
		(...args: Parameters<T>) => {
			const now = new Date().getTime();

			if (now - lastCall.current >= delay) {
				savedCallback.current(...args);
				lastCall.current = now;
			}
		},
		[delay]
	);
}

export default useThrottle;
