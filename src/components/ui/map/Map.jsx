"use client";
import MapLibreGL from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTheme } from "next-themes";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

export const MapContext = createContext(null);

export function useMap() {
	const context = useContext(MapContext);
	if (!context) {
		throw new Error("useMap must be used within a Map component");
	}
	return context;
}

const defaultStyles = {
	dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
	light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
};

const DefaultLoader = () => (
	<div className="absolute inset-0 flex items-center justify-center">
		<div className="flex gap-1">
			<span className="size-1.5 rounded-full bg-muted-foreground/60 animate-pulse" />
			<span className="size-1.5 rounded-full bg-muted-foreground/60 animate-pulse [animation-delay:150ms]" />
			<span className="size-1.5 rounded-full bg-muted-foreground/60 animate-pulse [animation-delay:300ms]" />
		</div>
	</div>
);

export function Map({ children, styles, ...props }) {
	const containerRef = useRef(null);
	const mapRef = useRef(null);
	const [isMounted, setIsMounted] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);
	const [isStyleLoaded, setIsStyleLoaded] = useState(false);
	const { resolvedTheme } = useTheme();

	const mapStyles = useMemo(
		() => ({
			dark: styles?.dark ?? defaultStyles.dark,
			light: styles?.light ?? defaultStyles.light,
		}),
		[styles]
	);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		if (!isMounted || !containerRef.current) return;

		const mapStyle = resolvedTheme === "dark" ? mapStyles.dark : mapStyles.light;

		const mapInstance = new MapLibreGL.Map({
			container: containerRef.current,
			style: mapStyle,
			attributionControl: false,
			...props,
		});

		const styleDataHandler = () => setIsStyleLoaded(true);
		const loadHandler = () => setIsLoaded(true);

		mapInstance.on("load", loadHandler);
		mapInstance.on("styledata", styleDataHandler);
		mapRef.current = mapInstance;

		return () => {
			mapInstance.off("load", loadHandler);
			mapInstance.off("styledata", styleDataHandler);
			mapInstance.remove();
			mapRef.current = null;
		};
	}, [isMounted]);

	useEffect(() => {
		if (mapRef.current) {
			setIsStyleLoaded(false);
			mapRef.current.setStyle(resolvedTheme === "dark" ? mapStyles.dark : mapStyles.light, {
				diff: true,
			});
		}
	}, [resolvedTheme]);

	const isLoading = !isMounted || !isLoaded || !isStyleLoaded;

	return (
		<MapContext.Provider
			value={{
				map: mapRef.current,
				isLoaded: isMounted && isLoaded && isStyleLoaded,
			}}>
			<div ref={containerRef} className="relative w-full h-full">
				{isLoading && <DefaultLoader />}
				{isMounted && children}
			</div>
		</MapContext.Provider>
	);
}
