import { useEffect } from "react";

export const useDocumentTitle = (title) => {
	useEffect(() => {
		const newTitle = title ? `RelaOne - ${title}` : "RelaOne - Volunteer Activity";
		document.title = newTitle;

		// Cleanup: reset ke default saat unmount
		return () => {
			document.title = "RelaOne - Volunteer Activity";
		};
	}, [title]);
};
