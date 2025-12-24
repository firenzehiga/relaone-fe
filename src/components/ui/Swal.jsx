import Swal from "sweetalert2";

/**
 * Default CSS classes for buttons used by the SweetAlert dialogs.
 * These follow the Tailwind-ish class names used across the project so dialogs
 * look consistent with the rest of the UI.
 */
const defaultConfirmBtn =
	"px-4 py-2 focus:outline-none rounded-md bg-emerald-500 hover:bg-emerald-600 text-white";
const defaultCancelBtn =
	"px-4 py-2 rounded-md border border-gray-300 bg-gray-200 hover:bg-gray-300 text-gray-700";

const baseCustomClass = (confirmButtonClass, cancelButtonClass) => ({
	popup: "bg-white rounded-xl shadow-xl p-5 max-w-md w-full",
	title: "text-lg font-semibold text-gray-900",
	content: "text-sm text-gray-600 dark:text-gray-300 mt-1",
	actions: "flex gap-3 justify-center mt-4",
	confirmButton: confirmButtonClass,
	cancelButton: cancelButtonClass,
});

function variantToConfig(variant) {
	switch (variant) {
		case "danger":
		case "red":
			return {
				btnClass: "px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white",
				icon: "warning",
				iconColor: "#dc2626",
			};
		case "warning":
			return {
				btnClass: "px-4 py-2 rounded-md bg-yellow-600 hover:bg-yellow-700 text-white",
				icon: "warning",
				iconColor: "#d97706",
			};
		case "success":
			return {
				btnClass: "px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white",
				icon: "success",
				iconColor: "#16a34a",
			};
		default:
			return {
				btnClass: "px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white",
				icon: "info",
				iconColor: undefined,
			};
	}
}

/**
 * Minimal confirm helper. Variant controls confirm button color and default icon.
 * Title/text/icon can be overridden via `options`.
 *
 * @param {Object} options
 * @param {string} [options.title]
 * @param {string} [options.text]
 * @param {'default'|'danger'|'warning'|'success'|'red'} [options.variant='default']
 * @returns {Promise<import('sweetalert2').SweetAlertResult>}
 */
export function confirm(options = {}) {
	const {
		title = "Apakah anda yakin?",
		text = "",
		variant = "default",
		confirmButtonText = "Ya, lanjutkan!",
		cancelButtonText = "Batal",
		showCancelButton = true,
		confirmButtonClass,
		cancelButtonClass = defaultCancelBtn,
		icon,
		iconColor,
		customClass: userCustomClass,
		...rest
	} = options;

	const v = variantToConfig(variant);
	const finalConfirmClass = confirmButtonClass || v.btnClass;
	const mergedClass = {
		...baseCustomClass(finalConfirmClass, cancelButtonClass),
		...(userCustomClass || {}),
	};

	return Swal.fire({
		title,
		text,
		icon: icon || v.icon,
		iconColor: iconColor ?? v.iconColor,
		showCancelButton,
		confirmButtonText,
		cancelButtonText,
		customClass: mergedClass,
		backdrop: true,
		...rest,
	});
}

/**
 * Convenience delete confirm with sensible defaults. Can be overridden.
 */
export function confirmDelete(options = {}) {
	const opts = {
		title: "Apa Anda yakin?",
		text: "Kamu tidak akan bisa mengembalikan ini!",
		icon: "warning",
		confirmButtonText: "Ya, hapus!",
		cancelButtonText: "Batal",
		variant: "danger",
		...options,
	};

	return confirm(opts);
}

/**
 * Convenience `swal*` helpers — object-only API (same style as `showToast`).
 * Example: swalWarning({ title: '...', text: '...', variant: 'danger' })
 */
export const swalSuccess = (options = {}) =>
	confirm({ ...options, variant: "success", icon: options.icon ?? "success" });

export const swalInfo = (options = {}) =>
	confirm({ ...options, variant: "default", icon: options.icon ?? "info" });

export const swalWarning = (options = {}) =>
	confirm({ ...options, variant: "warning", icon: options.icon ?? "warning" });

export const swalError = (options = {}) =>
	confirm({ ...options, variant: "danger", icon: options.icon ?? "error" });

export const swalDelete = (options = {}) => {
	const title = options.title ?? "Apa Anda yakin?";
	const text = options.text ?? "Kamu tidak akan bisa mengembalikan ini!";
	const rest = { ...options };
	delete rest.title;
	delete rest.text;
	return confirmDelete({ title, text, ...rest });
};

export default {
	confirm,
	confirmDelete,
	swalSuccess,
	swalInfo,
	swalWarning,
	swalError,
	swalDelete,
};
