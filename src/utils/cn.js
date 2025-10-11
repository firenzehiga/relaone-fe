/**
 * Utility function untuk menggabungkan class names CSS dengan aman
 * Menghilangkan class yang falsy (null, undefined, false, empty string)
 * Berguna untuk conditional styling dan menggabungkan multiple class
 *
 * @param {...(string|null|undefined|boolean)} classes - Class names yang akan digabungkan
 * @returns {string} String class names yang sudah digabungkan dan difilter
 *
 * @example
 * cn("btn", "btn-primary", isDisabled && "btn-disabled", "")
 * // returns: "btn btn-primary btn-disabled" (jika isDisabled = true)
 *
 * @example
 * cn("text-red-500", null, undefined, "font-bold")
 * // returns: "text-red-500 font-bold"
 */
export function cn(...classes) {
	return classes.filter(Boolean).join(" ");
}
