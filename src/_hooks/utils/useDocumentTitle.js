import { useEffect } from "react";

export const useDocumentTitle = (title) => {
	useEffect(() => {
		const newTitle = title
			? `RelaOne - ${title}`
			: "RelaOne - Mari Bersama-sama Membuat Perubahan Positif";
		document.title = newTitle;

		// Cleanup: reset ke default saat unmount
		return () => {
			document.title = "RelaOne - Mari Bersama-sama Membuat Perubahan Positif";
		};
	}, [title]);
};
