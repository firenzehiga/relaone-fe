import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, MapPin, Star, ExternalLink } from "lucide-react";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import Badge from "../ui/Badge";

const SavedLocationsManager = ({ organizationId }) => {
	const [locations, setLocations] = useState([]);
	const [showAddModal, setShowAddModal] = useState(false);
	const [editingLocation, setEditingLocation] = useState(null);
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		address: "",
		latitude: "",
		longitude: "",
		place_id: "",
		formatted_address: "",
		city: "",
		province: "",
		postal_code: "",
		country: "Indonesia",
		map_zoom_level: 15,
		is_default: false,
	});

	// Load saved locations
	useEffect(() => {
		// In real app, fetch from API
		fetch("/src/mock/saved_locations.json")
			.then((res) => res.json())
			.then((data) => {
				const orgLocations = data.filter(
					(loc) => loc.organization_id === organizationId
				);
				setLocations(orgLocations);
			})
			.catch(console.error);
	}, [organizationId]);

	const handleAddLocation = () => {
		setEditingLocation(null);
		setFormData({
			name: "",
			description: "",
			address: "",
			latitude: "",
			longitude: "",
			place_id: "",
			formatted_address: "",
			city: "",
			province: "",
			postal_code: "",
			country: "Indonesia",
			map_zoom_level: 15,
			is_default: false,
		});
		setShowAddModal(true);
	};

	const handleEditLocation = (location) => {
		setEditingLocation(location);
		setFormData(location);
		setShowAddModal(true);
	};

	const handleSaveLocation = () => {
		if (editingLocation) {
			// Update existing location
			setLocations((prev) =>
				prev.map((loc) =>
					loc.id === editingLocation.id
						? { ...formData, id: editingLocation.id }
						: loc
				)
			);
		} else {
			// Add new location
			const newLocation = {
				...formData,
				id: Date.now(),
				organization_id: organizationId,
				usage_count: 0,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			};
			setLocations((prev) => [...prev, newLocation]);
		}
		setShowAddModal(false);
	};

	const handleDeleteLocation = (locationId) => {
		if (confirm("Apakah Anda yakin ingin menghapus lokasi ini?")) {
			setLocations((prev) => prev.filter((loc) => loc.id !== locationId));
		}
	};

	const handleSetDefault = (locationId) => {
		setLocations((prev) =>
			prev.map((loc) => ({
				...loc,
				is_default: loc.id === locationId,
			}))
		);
	};

	const searchGooglePlaces = async (query) => {
		// In real app, call Google Places API
		console.log("Searching for:", query);
		// Mock response
		return [
			{
				place_id: "ChIJzZQeJl0aaDERvp9NWg2-k7M",
				formatted_address:
					"Jl. Example No.123, Jakarta Pusat, DKI Jakarta, Indonesia",
				geometry: {
					location: {
						lat: -6.2088,
						lng: 106.8456,
					},
				},
				address_components: [
					{
						long_name: "Jakarta Pusat",
						types: ["administrative_area_level_2"],
					},
					{ long_name: "DKI Jakarta", types: ["administrative_area_level_1"] },
					{ long_name: "12345", types: ["postal_code"] },
				],
			},
		];
	};

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200">
			<div className="px-6 py-4 border-b border-gray-200">
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-lg font-semibold text-gray-900">
							Lokasi Tersimpan
						</h3>
						<p className="text-sm text-gray-600">
							Kelola lokasi yang sering digunakan untuk event
						</p>
					</div>
					<Button variant="primary" onClick={handleAddLocation}>
						<Plus size={16} className="mr-2" />
						Tambah Lokasi
					</Button>
				</div>
			</div>

			<div className="p-6">
				{locations.length === 0 ? (
					<div className="text-center py-12">
						<div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
							<MapPin className="text-gray-400" size={24} />
						</div>
						<h4 className="text-lg font-semibold text-gray-900 mb-2">
							Belum ada lokasi tersimpan
						</h4>
						<p className="text-gray-600 mb-4">
							Mulai tambahkan lokasi yang sering Anda gunakan
						</p>
						<Button variant="primary" onClick={handleAddLocation}>
							Tambah Lokasi Pertama
						</Button>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{locations.map((location) => (
							<div
								key={location.id}
								className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
								<div className="flex items-start justify-between mb-3">
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-1">
											<h4 className="font-semibold text-gray-900">
												{location.name}
											</h4>
											{location.is_default && (
												<Badge variant="warning" size="sm">
													<Star size={12} className="mr-1" />
													Default
												</Badge>
											)}
										</div>
										<p className="text-sm text-gray-600 mb-2">
											{location.description}
										</p>
										<p className="text-xs text-gray-500 line-clamp-2">
											{location.address}
										</p>
										<p className="text-xs text-gray-500">
											{location.city}, {location.province}
										</p>
									</div>
									<div className="flex gap-1 ml-2">
										<Button
											variant="ghost"
											size="xs"
											onClick={() => handleEditLocation(location)}>
											<Edit size={14} />
										</Button>
										<Button
											variant="ghost"
											size="xs"
											onClick={() =>
												window.open(
													`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`,
													"_blank"
												)
											}>
											<ExternalLink size={14} />
										</Button>
										<Button
											variant="ghost"
											size="xs"
											onClick={() => handleDeleteLocation(location.id)}
											className="text-red-600 hover:text-red-700">
											<Trash2 size={14} />
										</Button>
									</div>
								</div>

								<div className="flex items-center justify-between text-xs text-gray-500">
									<span>Digunakan {location.usage_count} kali</span>
									{!location.is_default && (
										<Button
											variant="outline"
											size="xs"
											onClick={() => handleSetDefault(location.id)}>
											Set Default
										</Button>
									)}
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Add/Edit Location Modal */}
			<Modal
				isOpen={showAddModal}
				onClose={() => setShowAddModal(false)}
				size="lg">
				<div className="px-6 py-4 border-b border-gray-200">
					<h3 className="text-lg font-semibold text-gray-900">
						{editingLocation ? "Edit Lokasi" : "Tambah Lokasi Baru"}
					</h3>
				</div>

				<div className="p-6 space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Nama Lokasi
							</label>
							<input
								type="text"
								value={formData.name}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, name: e.target.value }))
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Contoh: Kantor Pusat"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Kota
							</label>
							<input
								type="text"
								value={formData.city}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, city: e.target.value }))
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Jakarta Pusat"
							/>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Deskripsi
						</label>
						<textarea
							value={formData.description}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									description: e.target.value,
								}))
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							rows="2"
							placeholder="Deskripsi singkat tentang lokasi ini"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Alamat Lengkap
						</label>
						<textarea
							value={formData.address}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, address: e.target.value }))
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							rows="2"
							placeholder="Jl. Contoh No.123, Jakarta"
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Latitude
							</label>
							<input
								type="number"
								step="any"
								value={formData.latitude}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										latitude: parseFloat(e.target.value),
									}))
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="-6.2088"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Longitude
							</label>
							<input
								type="number"
								step="any"
								value={formData.longitude}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										longitude: parseFloat(e.target.value),
									}))
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="106.8456"
							/>
						</div>
					</div>

					<div className="flex items-center">
						<input
							type="checkbox"
							id="is_default"
							checked={formData.is_default}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									is_default: e.target.checked,
								}))
							}
							className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
						/>
						<label
							htmlFor="is_default"
							className="ml-2 block text-sm text-gray-700">
							Jadikan sebagai lokasi default
						</label>
					</div>

					{/* Google Map Preview */}
					{formData.latitude && formData.longitude && (
						<div className="mt-4">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Preview Lokasi
							</label>
							<div className="bg-gray-100 rounded-lg overflow-hidden h-48">
								<iframe
									width="100%"
									height="100%"
									style={{ border: 0 }}
									loading="lazy"
									allowFullScreen
									referrerPolicy="no-referrer-when-downgrade"
									src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${formData.latitude},${formData.longitude}&zoom=${formData.map_zoom_level}`}
								/>
							</div>
						</div>
					)}
				</div>

				<div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
					<Button variant="outline" onClick={() => setShowAddModal(false)}>
						Batal
					</Button>
					<Button variant="primary" onClick={handleSaveLocation}>
						{editingLocation ? "Update" : "Simpan"}
					</Button>
				</div>
			</Modal>
		</div>
	);
};

export default SavedLocationsManager;
