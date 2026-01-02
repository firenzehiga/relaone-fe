import { useMemo, useState } from "react";
import { Map, MapMarker, MarkerContent, MapPopup, MapRoute } from "@/components/ui/map";
import { MapIcon } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { getGoogleMapsUrl } from "@/utils";

export default function LocationMapView({ locations }) {
	const [selectedLocationId, setSelectedLocationId] = useState(null);

	// Prepare route coordinates from locations
	const routeCoordinates = useMemo(() => {
		if (!locations || locations.length === 0) return [];
		return locations
			.filter((loc) => loc.longitude && loc.latitude)
			.map((loc) => [parseFloat(loc.longitude), parseFloat(loc.latitude)]);
	}, [locations]);

	// Calculate map center (center of all locations)
	const mapCenter = useMemo(() => {
		if (!locations || locations.length === 0) return [106.8456, -6.2088]; // Default Jakarta
		const validLocs = locations.filter((loc) => loc.longitude && loc.latitude);
		if (validLocs.length === 0) return [106.8456, -6.2088];

		const avgLng = validLocs.reduce((sum, loc) => sum + parseFloat(loc.longitude), 0) / validLocs.length;
		const avgLat = validLocs.reduce((sum, loc) => sum + parseFloat(loc.latitude), 0) / validLocs.length;
		return [avgLng, avgLat];
	}, [locations]);

	if (!locations || locations.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-96 text-gray-600 bg-gray-50 rounded-lg">
				<MapIcon className="w-12 h-12 text-gray-400 mb-4" />
				<h3 className="text-lg font-semibold mb-2">Belum Ada Lokasi</h3>
				<p className="text-gray-500 mb-4 text-center">
					Tambahkan lokasi pertama untuk melihat di peta.
				</p>
			</div>
		);
	}

	return (
		<div className="relative">
			<div className="h-[600px] w-full rounded-lg overflow-hidden border border-gray-200">
				<Map center={mapCenter} zoom={locations.length === 1 ? 15 : 11}>
					{/* Route connecting all locations */}
					{routeCoordinates.length > 1 && (
						<MapRoute coordinates={routeCoordinates} color="#10b981" width={3} opacity={0.6} />
					)}

					{/* Markers for each location */}
					{locations.map((location, index) => {
						if (!location.longitude || !location.latitude) return null;

						const lng = parseFloat(location.longitude);
						const lat = parseFloat(location.latitude);

						return (
							<MapMarker key={location.id} longitude={lng} latitude={lat}>
								<MarkerContent>
									<button
										onClick={() =>
											setSelectedLocationId(
												selectedLocationId === location.id ? null : location.id
											)
										}
										className="relative group">
										<div className="size-8 rounded-full bg-emerald-500 border-3 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold hover:scale-110 transition-transform cursor-pointer">
											{index + 1}
										</div>
										<div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-emerald-500/30 rounded-full blur-sm" />
									</button>
								</MarkerContent>

								{/* Popup when marker is clicked */}
								{selectedLocationId === location.id && (
									<MapPopup
										longitude={lng}
										latitude={lat}
										onClose={() => setSelectedLocationId(null)}
										closeButton
										closeOnClick={false}
										focusAfterOpen={false}
										offset={[0, -15]}>
										<div className="w-[200px] space-y-2">
											<div className="flex items-start gap-2">
												<h3 className="font-semibold text-gray-900 text-xs break-words flex-1 leading-tight">
													{location.nama || "Unnamed Location"}
												</h3>
												{location.tipe && (
													<Badge
														variant={
															location.tipe === "event"
																? "primary"
																: location.tipe === "organization"
																? "warning"
																: "secondary"
														}
														className="text-[10px] flex-shrink-0">
														{location.tipe}
													</Badge>
												)}
											</div>

											<div className="space-y-1 text-[10px] text-gray-600 leading-tight">
												{location.alamat && (
													<p className="break-words">
														<strong>Alamat:</strong> {location.alamat}
													</p>
												)}
												{location.kota && (
													<p className="break-words">
														<strong>Kota:</strong> {location.kota}
													</p>
												)}
												{location.provinsi && (
													<p className="break-words">
														<strong>Provinsi:</strong> {location.provinsi}
													</p>
												)}
												<p className="pt-1 border-t border-gray-200 text-[9px]">
													<strong>Koordinat:</strong> {lat.toFixed(5)}, {lng.toFixed(5)}
												</p>
											</div>

											<div className="pt-1">
												<a
													href={getGoogleMapsUrl({ location })}
													target="_blank"
													rel="noreferrer"
													className="block text-center px-2 py-1.5 bg-blue-500 text-white rounded-md text-[10px] font-medium hover:bg-blue-600 transition-colors">
													Buka di Maps
												</a>
											</div>
										</div>
									</MapPopup>
								)}
							</MapMarker>
						);
					})}
				</Map>
			</div>

			{/* Map Legend */}
			<div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
				<h4 className="text-sm font-semibold text-gray-900 mb-2">📍 Legend & Info</h4>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-600">
					<div>
						<p>
							<strong>Total Lokasi:</strong> {locations.length}
						</p>
						<p className="mt-1">
							<strong>Garis Hijau:</strong> Menghubungkan semua lokasi (untuk visualisasi
							persebaran)
						</p>
					</div>
					<div>
						<p>
							<strong>Marker Nomor:</strong> Urutan lokasi sesuai data
						</p>
						<p className="mt-1">
							<strong>Klik Marker:</strong> Lihat detail lokasi
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
