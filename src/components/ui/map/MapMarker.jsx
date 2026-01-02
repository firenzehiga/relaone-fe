"use client";
import MapLibreGL from "maplibre-gl";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMap } from "./Map";

const MarkerContext = createContext(null);

export function useMarkerContext() {
	const context = useContext(MarkerContext);
	if (!context) {
		throw new Error("Marker components must be used within MapMarker");
	}
	return context;
}

export function MapMarker({
	longitude,
	latitude,
	children,
	onClick,
	onMouseEnter,
	onMouseLeave,
	onDragStart,
	onDrag,
	onDragEnd,
	draggable = false,
	...markerOptions
}) {
	const { map, isLoaded } = useMap();
	const markerRef = useRef(null);
	const markerElementRef = useRef(null);
	const [isReady, setIsReady] = useState(false);
	const markerOptionsRef = useRef(markerOptions);

	useEffect(() => {
		if (!isLoaded || !map) return;

		const container = document.createElement("div");
		markerElementRef.current = container;

		const marker = new MapLibreGL.Marker({
			...markerOptions,
			element: container,
			draggable,
		})
			.setLngLat([longitude, latitude])
			.addTo(map);

		markerRef.current = marker;

		const handleClick = (e) => onClick?.(e);
		const handleMouseEnter = (e) => onMouseEnter?.(e);
		const handleMouseLeave = (e) => onMouseLeave?.(e);

		container.addEventListener("click", handleClick);
		container.addEventListener("mouseenter", handleMouseEnter);
		container.addEventListener("mouseleave", handleMouseLeave);

		const handleDragStart = () => {
			const lngLat = marker.getLngLat();
			onDragStart?.({ lng: lngLat.lng, lat: lngLat.lat });
		};
		const handleDrag = () => {
			const lngLat = marker.getLngLat();
			onDrag?.({ lng: lngLat.lng, lat: lngLat.lat });
		};
		const handleDragEnd = () => {
			const lngLat = marker.getLngLat();
			onDragEnd?.({ lng: lngLat.lng, lat: lngLat.lat });
		};

		marker.on("dragstart", handleDragStart);
		marker.on("drag", handleDrag);
		marker.on("dragend", handleDragEnd);

		setIsReady(true);

		return () => {
			container.removeEventListener("click", handleClick);
			container.removeEventListener("mouseenter", handleMouseEnter);
			container.removeEventListener("mouseleave", handleMouseLeave);

			marker.off("dragstart", handleDragStart);
			marker.off("drag", handleDrag);
			marker.off("dragend", handleDragEnd);

			marker.remove();
			markerRef.current = null;
			markerElementRef.current = null;
			setIsReady(false);
		};
	}, [map, isLoaded]);

	useEffect(() => {
		markerRef.current?.setLngLat([longitude, latitude]);
	}, [longitude, latitude]);

	useEffect(() => {
		markerRef.current?.setDraggable(draggable);
	}, [draggable]);

	useEffect(() => {
		if (!markerRef.current) return;
		const prev = markerOptionsRef.current;

		if (prev.offset !== markerOptions.offset) {
			markerRef.current.setOffset(markerOptions.offset ?? [0, 0]);
		}
		if (prev.rotation !== markerOptions.rotation) {
			markerRef.current.setRotation(markerOptions.rotation ?? 0);
		}
		if (prev.rotationAlignment !== markerOptions.rotationAlignment) {
			markerRef.current.setRotationAlignment(markerOptions.rotationAlignment ?? "auto");
		}
		if (prev.pitchAlignment !== markerOptions.pitchAlignment) {
			markerRef.current.setPitchAlignment(markerOptions.pitchAlignment ?? "auto");
		}

		markerOptionsRef.current = markerOptions;
	}, [markerOptions]);

	return (
		<MarkerContext.Provider value={{ markerRef, markerElementRef, map, isReady }}>
			{children}
		</MarkerContext.Provider>
	);
}

export function MarkerContent({ children, className }) {
	const { markerElementRef, isReady } = useMarkerContext();

	if (!isReady || !markerElementRef.current) return null;

	return createPortal(
		<div className={cn("relative cursor-pointer", className)}>
			{children || <DefaultMarkerIcon />}
		</div>,
		markerElementRef.current
	);
}

function DefaultMarkerIcon() {
	return (
		<div className="relative h-4 w-4 rounded-full border-2 border-white bg-blue-500 shadow-lg" />
	);
}

export function MarkerPopup({ children, className, closeButton = false, ...popupOptions }) {
	const { markerRef, isReady } = useMarkerContext();
	const containerRef = useRef(null);
	const popupRef = useRef(null);
	const [mounted, setMounted] = useState(false);
	const popupOptionsRef = useRef(popupOptions);

	useEffect(() => {
		if (!isReady || !markerRef.current) return;

		const container = document.createElement("div");
		containerRef.current = container;

		const popup = new MapLibreGL.Popup({
			offset: 16,
			...popupOptions,
			closeButton: false,
		})
			.setMaxWidth("none")
			.setDOMContent(container);

		popupRef.current = popup;
		markerRef.current.setPopup(popup);
		setMounted(true);

		return () => {
			popup.remove();
			popupRef.current = null;
			containerRef.current = null;
			setMounted(false);
		};
	}, [isReady]);

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

	const handleClose = () => popupRef.current?.remove();

	if (!mounted || !containerRef.current) return null;

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
		containerRef.current
	);
}

export function MarkerTooltip({ children, className, ...popupOptions }) {
	const { markerRef, markerElementRef, map, isReady } = useMarkerContext();
	const containerRef = useRef(null);
	const popupRef = useRef(null);
	const [mounted, setMounted] = useState(false);
	const popupOptionsRef = useRef(popupOptions);

	useEffect(() => {
		if (!isReady || !markerRef.current || !markerElementRef.current || !map) return;

		const container = document.createElement("div");
		containerRef.current = container;

		const popup = new MapLibreGL.Popup({
			offset: 16,
			...popupOptions,
			closeOnClick: true,
			closeButton: false,
		})
			.setMaxWidth("none")
			.setDOMContent(container);

		popupRef.current = popup;

		const markerElement = markerElementRef.current;
		const marker = markerRef.current;

		const handleMouseEnter = () => {
			popup.setLngLat(marker.getLngLat()).addTo(map);
		};
		const handleMouseLeave = () => popup.remove();

		markerElement.addEventListener("mouseenter", handleMouseEnter);
		markerElement.addEventListener("mouseleave", handleMouseLeave);
		setMounted(true);

		return () => {
			markerElement.removeEventListener("mouseenter", handleMouseEnter);
			markerElement.removeEventListener("mouseleave", handleMouseLeave);
			popup.remove();
			popupRef.current = null;
			containerRef.current = null;
			setMounted(false);
		};
	}, [isReady, map]);

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

	if (!mounted || !containerRef.current) return null;

	return createPortal(
		<div
			className={cn(
				"rounded-md bg-foreground px-2 py-1 text-xs text-background shadow-md animate-in fade-in-0 zoom-in-95",
				className
			)}>
			{children}
		</div>,
		containerRef.current
	);
}

export function MarkerLabel({ children, className, position = "top" }) {
	const positionClasses = {
		top: "bottom-full mb-1",
		bottom: "top-full mt-1",
	};

	return (
		<div
			className={cn(
				"absolute left-1/2 -translate-x-1/2 whitespace-nowrap",
				"text-[10px] font-medium text-foreground",
				positionClasses[position],
				className
			)}>
			{children}
		</div>
	);
}
