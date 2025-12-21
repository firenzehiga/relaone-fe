import { useState, useEffect } from "react";

/**
 * Custom hook untuk debounce value
 * @param {any} value - Value yang akan di-debounce
 * @param {number} delay - Delay dalam milliseconds (default: 500ms)
 * @returns {any} Debounced value
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 500);
 *
 * useEffect(() => {
 *   // Fetch data dengan debouncedSearch
 * }, [debouncedSearch]);
 */
export const useDebounce = (value, delay = 500) => {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		// Set timeout untuk update debounced value
		const timer = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		// Cleanup function untuk clear timeout jika value berubah sebelum delay selesai
		return () => {
			clearTimeout(timer);
		};
	}, [value, delay]);

	return debouncedValue;
};
