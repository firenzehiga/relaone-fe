import { useState, useEffect, useRef } from "react";
import { Map, MapMarker, MarkerContent, MapControls, useMap } from "@/components/ui/map";
import { MapPin, Search, Loader2, X } from "lucide-react";

/**
 * MapCoordinatePicker - Interactive map untuk memilih koordinat
 *
 * @param {Object} props
 * @param {number} props.latitude - Initial latitude
 * @param {number} props.longitude - Initial longitude
 * @param {number} props.zoom - Initial zoom level (default: 15)
 * @param {Function} props.onChange - Callback when coordinates change: (lat, lng, zoom, locationData) => {}
 * @param {string} props.className - Additional CSS classes
 */
export default function MapCoordinatePicker({
	latitude = -6.2088,
	longitude = 106.8456,
	zoom = 15,
	onChange,
	className = "",
}) {
	const latNum = typeof latitude === "number" ? latitude : parseFloat(latitude);
	const lngNum = typeof longitude === "number" ? longitude : parseFloat(longitude);
	const zoomNum = typeof zoom === "number" ? zoom : parseFloat(zoom);

	const [markerPos, setMarkerPos] = useState({
		lat: Number.isFinite(latNum) ? latNum : -6.2088,
		lng: Number.isFinite(lngNum) ? lngNum : 106.8456,
	});
	const [mapCenter, setMapCenter] = useState([
		Number.isFinite(lngNum) ? lngNum : 106.8456,
		Number.isFinite(latNum) ? latNum : -6.2088,
	]);
	const [mapZoom, setMapZoom] = useState(Number.isFinite(zoomNum) ? zoomNum : 15);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [isSearching, setIsSearching] = useState(false);
	const [showResults, setShowResults] = useState(false);
	const searchTimeoutRef = useRef(null);

	// Sync initial props to marker (coerce to numbers)
	useEffect(() => {
		const lat = typeof latitude === "number" ? latitude : parseFloat(latitude);
		const lng = typeof longitude === "number" ? longitude : parseFloat(longitude);
		if (Number.isFinite(lat) && Number.isFinite(lng)) {
			setMarkerPos({ lat, lng });
			setMapCenter([lng, lat]);
		}
	}, [latitude, longitude]);

	// Debounced search
	useEffect(() => {
		if (searchQuery.length < 3) {
			setSearchResults([]);
			setShowResults(false);
			return;
		}

		if (searchTimeoutRef.current) {
			clearTimeout(searchTimeoutRef.current);
		}

		setIsSearching(true);
		searchTimeoutRef.current = setTimeout(async () => {
			try {
				const response = await fetch(
					`https://nominatim.openstreetmap.org/search?` +
						`q=${encodeURIComponent(searchQuery)}&` +
						`format=json&` +
						`countrycodes=id&` + // Indonesia only
						`limit=5&` +
						`addressdetails=1`
				);
				const data = await response.json();
				setSearchResults(data);
				setShowResults(true);
			} catch (error) {
				console.error("Search error:", error);
				setSearchResults([]);
			} finally {
				setIsSearching(false);
			}
		}, 500); // 500ms debounce

		return () => {
			if (searchTimeoutRef.current) {
				clearTimeout(searchTimeoutRef.current);
			}
		};
	}, [searchQuery]);

	const handleSelectLocation = (result) => {
		const lat = parseFloat(result.lat);
		const lng = parseFloat(result.lon);
		setMarkerPos({ lat, lng });
		setMapCenter([lng, lat]); // Update map center
		setMapZoom(17); // Zoom in for selected location
		setSearchQuery(result.display_name);
		setShowResults(false);

		// Extract location details
		const locationData = {
			name: result.display_name,
			address: result.address?.road || result.address?.suburb || result.display_name,
			city: result.address?.city || result.address?.town || result.address?.village || "",
			province: result.address?.state || "",
			country: result.address?.country || "Indonesia",
		};

		onChange?.(lat, lng, 17, locationData); // zoom to 17 for selected location
	};

	const handleMapClick = (e) => {
		const { lat, lng } = e.lngLat;
		setMarkerPos({ lat, lng });
		onChange?.(lat, lng, zoom);
	};

	const handleMarkerDragEnd = (coords) => {
		setMarkerPos(coords);
		onChange?.(coords.lat, coords.lng, zoom);
	};

	const clearSearch = () => {
		setSearchQuery("");
		setSearchResults([]);
		setShowResults(false);
	};

	return (
		<div className={`flex flex-col gap-2 ${className}`}>
			{/* Search Box - Outside map */}
			<div className="relative">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
				<input
					type="text"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					placeholder="🔍 Cari lokasi..."
					className="w-full pl-10 pr-10 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
				/>
				{isSearching && (
					<Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 animate-spin" />
				)}
				{searchQuery && !isSearching && (
					<button
						onClick={clearSearch}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
						<X className="w-4 h-4" />
					</button>
				)}

				{/* Search Results Dropdown */}
				{showResults && searchResults.length > 0 && (
					<div className="absolute top-full mt-1 w-full bg-white rounded-lg shadow-xl border border-gray-200 max-h-64 overflow-y-auto z-30">
						{searchResults.map((result, index) => (
							<button
								key={index}
								onClick={() => handleSelectLocation(result)}
								className="w-full px-4 py-3 text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors">
								<div className="flex items-start gap-2">
									<MapPin className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-gray-900 truncate">
											{result.display_name}
										</p>
										{result.address && (
											<p className="text-xs text-gray-500 mt-0.5">
												{[
													result.address.city || result.address.town || result.address.village,
													result.address.state,
												]
													.filter(Boolean)
													.join(", ")}
											</p>
										)}
									</div>
								</div>
							</button>
						))}
					</div>
				)}

				{/* No Results */}
				{showResults && searchQuery.length >= 3 && searchResults.length === 0 && !isSearching && (
					<div className="absolute top-full mt-1 w-full bg-white rounded-lg shadow-xl border border-gray-200 px-4 py-3 z-30">
						<p className="text-sm text-gray-500">Tidak ada hasil untuk "{searchQuery}"</p>
					</div>
				)}
			</div>

			{/* Map Container */}
			<div className="relative flex-1 rounded-lg overflow-hidden border border-gray-200">
				<Map center={mapCenter} zoom={mapZoom} onClick={handleMapClick}>
					<FlyToHandler center={mapCenter} zoom={mapZoom} />
					<MapClickHandler onMapClick={handleMapClick} />

					<MapMarker
						longitude={markerPos.lng}
						latitude={markerPos.lat}
						draggable={true}
						onDragEnd={handleMarkerDragEnd}>
						<MarkerContent>
							<div className="relative">
								<MapPin className="w-8 h-8 text-red-500 fill-red-500 drop-shadow-lg" />
								<div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-500/30 rounded-full blur-sm" />
							</div>
						</MarkerContent>
					</MapMarker>

					<MapControls
						position="top-right"
						showZoom={true}
						showCompass={true}
						showLocate={true}
						showFullscreen={false}
					/>
				</Map>

				{/* Coordinate Display */}
				<div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-gray-200 text-xs font-mono z-10">
					<div className="text-gray-600">
						<span className="font-semibold">Lat:</span> {Number(markerPos.lat).toFixed(6)}
					</div>
					<div className="text-gray-600">
						<span className="font-semibold">Lng:</span> {Number(markerPos.lng).toFixed(6)}
					</div>
				</div>

				{/* Instructions */}
				<div className="absolute bottom-4 right-4 bg-blue-50/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md border border-blue-200 text-xs z-10 max-w-[200px]">
					<p className="text-blue-900 font-medium mb-1">💡 Tips:</p>
					<ul className="text-blue-800 space-y-0.5 text-[10px]">
						<li>• Klik/drag marker</li>
						<li>• Zoom dengan scroll</li>
					</ul>
				</div>
			</div>
		</div>
	);
}

/**
 * Helper component to fly to new location with animation
 */
function FlyToHandler({ center, zoom }) {
	const { map, isLoaded } = useMap();
	const prevCenterRef = useRef(center);
	const prevZoomRef = useRef(zoom);

	useEffect(() => {
		if (!isLoaded || !map) return;

		// Check if center or zoom changed
		const centerChanged =
			prevCenterRef.current[0] !== center[0] || prevCenterRef.current[1] !== center[1];
		const zoomChanged = prevZoomRef.current !== zoom;

		if (centerChanged || zoomChanged) {
			map.flyTo({
				center: center,
				zoom: zoom,
				duration: 1500, // 1.5 second animation
				essential: true,
			});

			prevCenterRef.current = center;
			prevZoomRef.current = zoom;
		}
	}, [map, isLoaded, center, zoom]);

	return null;
}

/**
 * Helper component to handle map clicks
 * Uses useMap hook to access map instance
 */
function MapClickHandler({ onMapClick }) {
	const { map, isLoaded } = useMap();

	useEffect(() => {
		if (!isLoaded || !map) return;

		const handleClick = (e) => {
			onMapClick(e);
		};

		map.on("click", handleClick);

		return () => {
			map.off("click", handleClick);
		};
	}, [map, isLoaded, onMapClick]);

	return null;
}
