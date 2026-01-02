import { useState, useEffect } from "react";
import { MapPin, Search, Star, ExternalLink, Navigation, Link, Copy, Eye } from "lucide-react";
import DynamicButton from "@/components/ui/DynamicButton";
import Badge from "@/components/ui/Badge";

export default function LocationPicker({
	organizationId,
	selectedLocation,
	onLocationSelect,
	className = "",
}) {
	const [savedLocations, setSavedLocations] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [activeTab, setActiveTab] = useState("link"); // link, saved, manual (remove search)
	const [mapLink, setMapLink] = useState("");
	const [linkError, setLinkError] = useState("");

	// Load saved locations
	useEffect(() => {
		if (organizationId) {
			fetch("/src/mock/saved_locations.json")
				.then((res) => res.json())
				.then((data) => {
					const orgLocations = data.filter((loc) => loc.organization_id === organizationId);
					setSavedLocations(orgLocations);
				})
				.catch(console.error);
		}
	}, [organizationId]);

	const handleSearchPlaces = async () => {
		if (!searchQuery.trim()) return;

		setLoading(true);
		try {
			// In real app, call Google Places API
			// const response = await googlePlacesSearch(searchQuery);

			// Mock search results
			const mockResults = [
				{
					place_id: "ChIJzZQeJl0aaDERvp9NWg2-k7M",
					name: searchQuery,
					formatted_address: `${searchQuery}, Jakarta Pusat, DKI Jakarta, Indonesia`,
					geometry: {
						location: {
							lat: -6.2088 + Math.random() * 0.1,
							lng: 106.8456 + Math.random() * 0.1,
						},
					},
					types: ["establishment"],
					rating: 4.2,
					user_ratings_total: 150,
				},
				{
					place_id: "ChIJzZQeJl0aaDERvp9NWg2-k7N",
					name: `${searchQuery} Alternatif`,
					formatted_address: `${searchQuery}, Jakarta Selatan, DKI Jakarta, Indonesia`,
					geometry: {
						location: {
							lat: -6.2588 + Math.random() * 0.1,
							lng: 106.8156 + Math.random() * 0.1,
						},
					},
					types: ["establishment"],
					rating: 4.0,
					user_ratings_total: 89,
				},
			];

			setSearchResults(mockResults);
		} catch (error) {
			console.error("Error searching places:", error);
		}
		setLoading(false);
	};

	const handleSelectSavedLocation = (location) => {
		onLocationSelect({
			name: location.name,
			address: location.address,
			latitude: location.latitude,
			longitude: location.longitude,
			place_id: location.place_id,
			formatted_address: location.formatted_address,
			city: location.city,
			province: location.province,
			postal_code: location.postal_code,
			country: location.country,
			map_zoom_level: location.map_zoom_level,
		});
	};

	const handleSelectSearchResult = (result) => {
		const location = {
			name: result.name,
			address: result.formatted_address,
			latitude: result.geometry.location.lat,
			longitude: result.geometry.location.lng,
			place_id: result.place_id,
			formatted_address: result.formatted_address,
			city: extractFromAddress(result.formatted_address, "city"),
			province: extractFromAddress(result.formatted_address, "province"),
			postal_code: extractFromAddress(result.formatted_address, "postal_code"),
			country: "Indonesia",
			map_zoom_level: 16,
		};
		onLocationSelect(location);
	};

	const extractFromAddress = (address, component) => {
		// Simple extraction logic - in real app, use Google Places details API
		const parts = address.split(", ");
		switch (component) {
			case "city":
				return parts[1] || "";
			case "province":
				return parts[2] || "";
			case "postal_code":
				return "";
			default:
				return "";
		}
	};

	// Extract coordinates from Google Maps links
	const extractCoordinatesFromLink = (link) => {
		setLinkError("");

		try {
			// Pattern 1: https://www.google.com/maps/place/Location+Name/@-6.2088,106.8456,15z
			const pattern1 = /@(-?\d+\.?\d*),(-?\d+\.?\d*),/;
			const match1 = link.match(pattern1);
			if (match1) {
				return {
					latitude: parseFloat(match1[1]),
					longitude: parseFloat(match1[2]),
				};
			}

			// Pattern 2: https://www.google.com/maps/@-6.2088,106.8456,15z
			const pattern2 = /@(-?\d+\.?\d*),(-?\d+\.?\d*)/;
			const match2 = link.match(pattern2);
			if (match2) {
				return {
					latitude: parseFloat(match2[1]),
					longitude: parseFloat(match2[2]),
				};
			}

			// Pattern 3: https://maps.google.com/?q=-6.2088,106.8456
			const pattern3 = /q=(-?\d+\.?\d*),(-?\d+\.?\d*)/;
			const match3 = link.match(pattern3);
			if (match3) {
				return {
					latitude: parseFloat(match3[1]),
					longitude: parseFloat(match3[2]),
				};
			}

			// Pattern 4: https://www.google.com/maps/search/-6.2088,106.8456
			const pattern4 = /search\/(-?\d+\.?\d*),(-?\d+\.?\d*)/;
			const match4 = link.match(pattern4);
			if (match4) {
				return {
					latitude: parseFloat(match4[1]),
					longitude: parseFloat(match4[2]),
				};
			}

			// Pattern 5: Simple coordinate format: -6.2088, 106.8456
			const pattern5 = /^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/;
			const match5 = link.trim().match(pattern5);
			if (match5) {
				return {
					latitude: parseFloat(match5[1]),
					longitude: parseFloat(match5[2]),
				};
			}

			return null;
		} catch (error) {
			return null;
		}
	};

	const handleProcessMapLink = () => {
		if (!mapLink.trim()) {
			setLinkError("Masukkan link Google Maps atau koordinat");
			return;
		}

		const coordinates = extractCoordinatesFromLink(mapLink);

		if (!coordinates) {
			setLinkError("Link tidak valid. Coba format lain atau salin link dari Google Maps");
			return;
		}

		// Validate coordinates (Indonesia range)
		if (
			coordinates.latitude < -11 ||
			coordinates.latitude > 6 ||
			coordinates.longitude < 95 ||
			coordinates.longitude > 141
		) {
			setLinkError("Koordinat tidak dalam wilayah Indonesia");
			return;
		}

		setLinkError("");

		onLocationSelect({
			...selectedLocation,
			name: selectedLocation?.name || "Lokasi dari Maps",
			latitude: coordinates.latitude,
			longitude: coordinates.longitude,
			map_zoom_level: 16,
			formatted_address: `${coordinates.latitude}, ${coordinates.longitude}`,
		});
	};

	return (
		<div className={`bg-white border border-gray-300 rounded-lg ${className}`}>
			{/* Tabs */}
			<div className="border-b border-gray-200">
				<div className="flex flex-wrap">
					<button
						className={`px-4 py-3 text-sm font-medium border-b-2 ${
							activeTab === "link"
								? "border-blue-500 text-blue-600"
								: "border-transparent text-gray-500 hover:text-gray-700"
						}`}
						onClick={() => setActiveTab("link")}>
						<Link size={14} className="mr-1 inline" />
						Link Maps (Utama)
					</button>
					<button
						className={`px-4 py-3 text-sm font-medium border-b-2 ${
							activeTab === "saved"
								? "border-blue-500 text-blue-600"
								: "border-transparent text-gray-500 hover:text-gray-700"
						}`}
						onClick={() => setActiveTab("saved")}>
						<Star size={14} className="mr-1 inline" />
						Tersimpan ({savedLocations.length})
					</button>
					<button
						className={`px-4 py-3 text-sm font-medium border-b-2 ${
							activeTab === "manual"
								? "border-blue-500 text-blue-600"
								: "border-transparent text-gray-500 hover:text-gray-700"
						}`}
						onClick={() => setActiveTab("manual")}>
						<MapPin size={14} className="mr-1 inline" />
						Manual
					</button>
				</div>
			</div>

			<div className="p-4">
				{/* Saved Locations Tab */}
				{activeTab === "saved" && (
					<div>
						{savedLocations.length === 0 ? (
							<div className="text-center py-8">
								<MapPin className="mx-auto text-gray-400 mb-2" size={24} />
								<p className="text-gray-600">Belum ada lokasi tersimpan</p>
								<p className="text-sm text-gray-500">Tambahkan lokasi di pengaturan organisasi</p>
							</div>
						) : (
							<div className="space-y-3 max-h-60 overflow-y-auto">
								{savedLocations.map((location) => (
									<div
										key={location.id}
										className={`p-3 border rounded-lg cursor-pointer transition-colors ${
											selectedLocation?.place_id === location.place_id
												? "border-blue-500 bg-blue-50"
												: "border-gray-200 hover:border-gray-300"
										}`}
										onClick={() => handleSelectSavedLocation(location)}>
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<div className="flex items-center gap-2 mb-1">
													<h4 className="font-medium text-gray-900">{location.name}</h4>
													{location.is_default && (
														<Badge variant="warning" size="sm">
															<Star size={10} className="mr-1" />
															Default
														</Badge>
													)}
												</div>
												<p className="text-sm text-gray-600 line-clamp-2">{location.address}</p>
												<p className="text-xs text-gray-500">
													{location.city}, {location.province}
												</p>
											</div>
											<DynamicButton
												variant="ghost"
												size="xs"
												onClick={(e) => {
													e.stopPropagation();
													window.open(
														`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`,
														"_blank"
													);
												}}>
												<ExternalLink size={12} />
											</DynamicButton>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				)}

				{/* Link Maps Tab */}
				{activeTab === "link" && (
					<div>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									<Link size={16} className="inline mr-2" />
									Link Google Maps atau Koordinat
								</label>
								<textarea
									value={mapLink}
									onChange={(e) => setMapLink(e.target.value)}
									onKeyPress={(e) =>
										e.key === "Enter" && e.shiftKey === false && handleProcessMapLink()
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
									rows="3"
									placeholder="Paste link dari Google Maps atau masukkan koordinat manual..."
								/>
								{linkError && <p className="text-red-600 text-sm mt-1">{linkError}</p>}
							</div>

							<DynamicButton
								variant="primary"
								onClick={handleProcessMapLink}
								disabled={!mapLink.trim()}
								className="w-full">
								<MapPin size={16} className="mr-2" />
								Proses Link/Koordinat
							</DynamicButton>

							<div className="bg-blue-50 rounded-lg p-4">
								<h4 className="font-medium text-blue-900 mb-2">� Cara Paling Mudah:</h4>
								<div className="space-y-2 text-sm text-blue-800">
									<div className="flex items-start gap-2">
										<span className="font-medium">1.</span>
										<span>
											Buka{" "}
											<a
												href="https://maps.google.com"
												target="_blank"
												rel="noopener noreferrer"
												className="underline">
												Google Maps
											</a>{" "}
											di browser
										</span>
									</div>
									<div className="flex items-start gap-2">
										<span className="font-medium">2.</span>
										<span>Cari dan klik lokasi yang diinginkan</span>
									</div>
									<div className="flex items-start gap-2">
										<span className="font-medium">3.</span>
										<span>Copy link dari address bar atau klik "Share" → "Copy link"</span>
									</div>
									<div className="flex items-start gap-2">
										<span className="font-medium">4.</span>
										<span>Paste link di atas → koordinat otomatis ter-extract! ✨</span>
									</div>
								</div>

								<div className="mt-3 pt-3 border-t border-blue-200">
									<h5 className="font-medium text-blue-900 mb-1">✅ Format yang Didukung:</h5>
									<div className="text-xs text-blue-700 space-y-1">
										<div>• Link dari address bar Google Maps</div>
										<div>• Link dari tombol "Share" → "Copy link"</div>
										<div>• Koordinat langsung: -6.2088, 106.8456</div>
										<div>• Semua format populer Google Maps</div>
									</div>
								</div>

								<div className="mt-3 pt-3 border-t border-blue-200">
									<h5 className="font-medium text-blue-900 mb-1">💡 Pro Tips:</h5>
									<div className="text-xs text-blue-700 space-y-1">
										<div>• Zoom in detail sebelum copy link untuk akurasi</div>
										<div>• Klik tepat di entrance/pintu masuk gedung</div>
										<div>• Test hasil dengan klik "Buka di Maps"</div>
									</div>
								</div>
							</div>

							{/* Quick Actions */}
							<div className="grid grid-cols-2 gap-2">
								<DynamicButton
									variant="outline"
									size="sm"
									onClick={() => {
										navigator.clipboard
											.readText()
											.then((text) => {
												setMapLink(text);
												setLinkError("");
											})
											.catch(() => {
												setLinkError("Gagal membaca clipboard");
											});
									}}
									className="flex items-center justify-center gap-1">
									<Copy size={14} />
									Paste dari Clipboard
								</DynamicButton>
								<DynamicButton
									variant="outline"
									size="sm"
									onClick={() => window.open("https://maps.google.com", "_blank")}
									className="flex items-center justify-center gap-1">
									<ExternalLink size={14} />
									Buka Google Maps
								</DynamicButton>
							</div>
						</div>
					</div>
				)}

				{/* Manual Input Tab */}
				{activeTab === "manual" && (
					<div className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Nama Lokasi</label>
								<input
									type="text"
									value={selectedLocation?.name || ""}
									onChange={(e) =>
										onLocationSelect({
											...selectedLocation,
											name: e.target.value,
										})
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="Nama tempat atau gedung"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Kota</label>
								<input
									type="text"
									value={selectedLocation?.city || ""}
									onChange={(e) =>
										onLocationSelect({
											...selectedLocation,
											city: e.target.value,
										})
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="Jakarta Pusat"
								/>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
							<textarea
								value={selectedLocation?.address || ""}
								onChange={(e) =>
									onLocationSelect({
										...selectedLocation,
										address: e.target.value,
									})
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								rows="3"
								placeholder="Jl. Contoh No.123, Jakarta"
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
								<input
									type="number"
									step="any"
									value={selectedLocation?.latitude || ""}
									onChange={(e) =>
										onLocationSelect({
											...selectedLocation,
											latitude: parseFloat(e.target.value),
										})
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="-6.2088"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
								<input
									type="number"
									step="any"
									value={selectedLocation?.longitude || ""}
									onChange={(e) =>
										onLocationSelect({
											...selectedLocation,
											longitude: parseFloat(e.target.value),
										})
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="106.8456"
								/>
							</div>
						</div>

						<div className="text-xs text-gray-500">
							💡 Tip: Anda bisa mendapatkan koordinat dengan klik kanan di Google Maps dan pilih
							koordinat yang muncul
						</div>
					</div>
				)}
			</div>

			{/* Selected Location Preview */}
			{selectedLocation && selectedLocation.latitude && selectedLocation.longitude && (
				<div className="border-t border-gray-200 p-4">
					<h4 className="text-sm font-medium text-gray-700 mb-2">Preview Lokasi Terpilih</h4>
					<div className="bg-gray-100 rounded-lg overflow-hidden h-32">
						<iframe
							width="100%"
							height="100%"
							style={{ border: 0 }}
							loading="lazy"
							allowFullScreen
							referrerPolicy="no-referrer-when-downgrade"
							src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${
								selectedLocation.latitude
							},${selectedLocation.longitude}&zoom=${selectedLocation.map_zoom_level || 15}`}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
