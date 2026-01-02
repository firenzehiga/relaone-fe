"use client";
import MapLibreGL from "maplibre-gl";
import { useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMap } from "./Map";

export function MapPopup({
	longitude,
	latitude,
	onClose,
	children,
	className,
	closeButton = false,
	...popupOptions
}) {
	const { map } = useMap();
	const popupRef = useRef(null);
	const popupOptionsRef = useRef(popupOptions);

	const container = useMemo(() => document.createElement("div"), []);

	useEffect(() => {
		if (!map) return;

		const popup = new MapLibreGL.Popup({
			offset: 16,
			...popupOptions,
			closeButton: false,
		})
			.setMaxWidth("none")
			.setDOMContent(container)
			.setLngLat([longitude, latitude])
			.addTo(map);

		const onCloseProp = () => onClose?.();

		popup.on("close", onCloseProp);

		popupRef.current = popup;

		return () => {
			popup.off("close", onCloseProp);
			if (popup.isOpen()) {
				popup.remove();
			}
			popupRef.current = null;
		};
	}, [map]);

	useEffect(() => {
		popupRef.current?.setLngLat([longitude, latitude]);
	}, [longitude, latitude]);

	useEffect(() => {
		if (!popupRef.current) return;
		const prev = popupOptionsRef.current;

		if (prev.offset !== popupOptions.offset) {
			popupRef.current.setOffset(popupOptions.offset ?? 16);
		}
		if (prev.maxWidth !== popupOptions.maxWidth && popupOptions.maxWidth) {
			popupRef.current.setMaxWidth(popupOptions.maxWidth ?? "none");
		}

		popupOptionsRef.current = popupOptions;
	}, [popupOptions]);

	const handleClose = () => {
		popupRef.current?.remove();
		onClose?.();
	};

	return createPortal(
		<div
			className={cn(
				"relative rounded-md border bg-popover p-3 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
				className
			)}>
			{closeButton && (
				<button
					type="button"
					onClick={handleClose}
					className="absolute top-1 right-1 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
					aria-label="Close popup">
					<X className="h-4 w-4" />
					<span className="sr-only">Close</span>
				</button>
			)}
			{children}
		</div>,
		container
	);
}
