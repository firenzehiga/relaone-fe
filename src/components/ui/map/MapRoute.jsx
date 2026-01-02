"use client";
import { useEffect, useId } from "react";
import { useMap } from "./Map";

export function MapRoute({ coordinates, color = "#4285F4", width = 3, opacity = 0.8, dashArray }) {
	const { map, isLoaded } = useMap();
	const id = useId();
	const sourceId = `route-source-${id}`;
	const layerId = `route-layer-${id}`;

	// Add source and layer on mount
	useEffect(() => {
		if (!isLoaded || !map) return;

		map.addSource(sourceId, {
			type: "geojson",
			data: {
				type: "Feature",
				properties: {},
				geometry: { type: "LineString", coordinates: [] },
			},
		});

		map.addLayer({
			id: layerId,
			type: "line",
			source: sourceId,
			layout: { "line-join": "round", "line-cap": "round" },
			paint: {
				"line-color": color,
				"line-width": width,
				"line-opacity": opacity,
				...(dashArray && { "line-dasharray": dashArray }),
			},
		});

		return () => {
			try {
				if (map.getLayer(layerId)) map.removeLayer(layerId);
				if (map.getSource(sourceId)) map.removeSource(sourceId);
			} catch {
				// ignore
			}
		};
	}, [isLoaded, map, sourceId, layerId]);

	// When coordinates change, update the source data
	useEffect(() => {
		if (!isLoaded || !map || coordinates.length < 2) return;

		const source = map.getSource(sourceId);
		if (source) {
			source.setData({
				type: "Feature",
				properties: {},
				geometry: { type: "LineString", coordinates },
			});
		}
	}, [isLoaded, map, coordinates, sourceId]);

	useEffect(() => {
		if (!isLoaded || !map || !map.getLayer(layerId)) return;

		map.setPaintProperty(layerId, "line-color", color);
		map.setPaintProperty(layerId, "line-width", width);
		map.setPaintProperty(layerId, "line-opacity", opacity);
		if (dashArray) {
			map.setPaintProperty(layerId, "line-dasharray", dashArray);
		}
	}, [isLoaded, map, layerId, color, width, opacity, dashArray]);

	return null;
}
