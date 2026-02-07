import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Hooks / Stores
import { useAuthStore } from "@/_hooks/useAuth";
import {
	useOrgLocationById,
	useOrgUpdateLocationMutation,
} from "@/_hooks/useLocations";
// import { useAdminOrganizations } from "@/_hooks/useOrganizations";

// UI Components
import Button from "@/components/ui/DynamicButton";
import CustomSkeleton from "@/components/ui/CustomSkeleton";
import { useForm } from "react-hook-form";
import { parseGoogleMapsUrl } from "@/utils";
import { AlertCircle } from "lucide-react";
import MapCoordinatePicker from "@/components/common/MapCoordinatePicker";

export default function OrganizationLocationEdit() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { register, handleSubmit, reset, setValue, getValues } = useForm({
		defaultValues: {
			nama: "",
			alamat: "",
			latitude: "",
			longitude: "",
			place_id: "",
			alamat_lengkap: "",
			kota: "",
			provinsi: "",
			negara: "Indonesia",
			zoom_level: 15,
			tipe: "",
		},
	});
	const { isLoading } = useAuthStore();

	const [gmapUrl, setGmapUrl] = useState("");
	const [parseError, setParseError] = useState("");

	const updateLocationMutation = useOrgUpdateLocationMutation();
	const {
		data: showLocation,
		isLoading: showLocationLoading,
		error: locationsError,
	} = useOrgLocationById(id);

	useEffect(() => {
		if (!showLocation) return;
		if (getValues("nama")) return;
		reset({
			nama: showLocation.nama || "",
			alamat: showLocation.alamat || "",
			latitude: showLocation.latitude || "",
			longitude: showLocation.longitude || "",
			place_id: showLocation.place_id || "",
			alamat_lengkap: showLocation.alamat_lengkap || "",
			kota: showLocation.kota || "",
			provinsi: showLocation.provinsi || "",
			negara: showLocation.negara || "",
			zoom_level: showLocation.zoom_level || 15,
			tipe: showLocation.tipe || "",
		});
	}, [showLocation]);

	const onSubmit = (data) => {
		setParseError("");
		const payload = new FormData();
		payload.append("_method", "PUT");
		for (const key in data) payload.append(key, data[key]);

		updateLocationMutation.mutateAsync({ id, data: payload });
	};
	const handleParse = () => {
		setParseError("");
		const result = parseGoogleMapsUrl(gmapUrl);
		if (!result) {
			setParseError(
				"Tidak dapat mem-parsing URL. Pastikan Anda menempelkan link share Google Maps (bukan URL pendek).\nCoba gunakan opsi 'Share' pada Google Maps → 'Copy link'.",
			);
			return;
		}

		const place = result.place || "";
		setValue("latitude", result.latitude || getValues("latitude"), {
			shouldDirty: true,
		});
		setValue("longitude", result.longitude || getValues("longitude"), {
			shouldDirty: true,
		});
		setValue("zoom_level", result.zoom_level ?? getValues("zoom_level"), {
			shouldDirty: true,
		});
		setValue("alamat", place || getValues("alamat"), { shouldDirty: true });
		if (!getValues("nama"))
			setValue("nama", place || getValues("nama"), { shouldDirty: true });
	};

	if (showLocationLoading) {
		return <CustomSkeleton.FormSkeleton title="Loading..." />;
	}

	if (locationsError) {
		return (
			<div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col items-center justify-center  text-gray-600">
					<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
					<h3 className="text-lg font-semibold mb-2">Error</h3>
					<p className="text-gray-500 mb-4 text-center">
						Gagal mengambil data lokasi.
					</p>
					<p className="text-red-500 mb-4 text-center font-semibold">
						{locationsError.message}
					</p>
				</div>
			</div>
		);
	}
	return (
		<div className="w-full mx-auto p-4 sm:p-6 max-w-6xl min-h-[calc(100vh-4rem)]">
			<div className="bg-white shadow-lg rounded-lg p-4 sm:p-6">
				<header className="mb-6 sm:mb-8">
					<h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
						Edit Lokasi
					</h1>
					<p className="text-xs sm:text-sm text-gray-500 mt-1">
						Isi detail lokasi. Anda bisa menempelkan link Google Maps dan
						menekan "Parse" untuk mengisi koordinat otomatis.
					</p>
				</header>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="space-y-6 flex flex-col">
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
						<div className="sm:col-span-2">
							<label
								htmlFor="nama"
								className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
								Nama Lokasi (bebas, hanya untuk pendataan){" "}
								<span className="text-red-500">*</span>
							</label>
							<input
								id="nama"
								{...register("nama")}
								type="text"
								required
								placeholder="Contoh: Lapangan RW 05"
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
							/>
						</div>

						<div>
							<label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
								Tipe Lokasi <span className="text-red-500">*</span>
							</label>
							<select
								{...register("tipe")}
								id="tipe"
								required
								className="mt-1 block w-full rounded-md border border-gray-200 px-2 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
								<option value="">Pilih tipe</option>
								<option value="event">Kegiatan - (event)</option>
								<option value="organization">Kantor - (organization)</option>
							</select>
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
						<div className="sm:col-span-2">
							<label
								htmlFor="alamat"
								className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
								Alamat <span className="text-red-500">*</span>
							</label>
							<input
								id="alamat"
								{...register("alamat")}
								type="text"
								required
								placeholder="Alamat (terisi otomatis dari Google Maps)"
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
							/>
						</div>
					</div>
					<div>
						<label
							htmlFor="alamat_lengkap"
							className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
							Alamat Tambahan
						</label>
						<input
							id="alamat_lengkap"
							{...register("alamat_lengkap")}
							type="text"
							placeholder="Alamat lengkap (opsional)"
							className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
						/>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<div>
							<label
								htmlFor="kota"
								className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
								Kota (opsional)
							</label>
							<input
								id="kota"
								{...register("kota")}
								placeholder="Kota (opsional)"
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2"
							/>
						</div>
						<div>
							<label
								htmlFor="provinsi"
								className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
								Provinsi (opsional)
							</label>
							<input
								id="provinsi"
								{...register("provinsi")}
								placeholder="Provinsi (opsional)"
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2"
							/>
						</div>
						<div>
							<label
								htmlFor="negara"
								className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
								Negara <span className="text-red-500">*</span>
							</label>
							<input
								id="negara"
								{...register("negara")}
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2"
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<div>
							<label
								htmlFor="latitude"
								className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
								Latitude (terisi otomatis)
							</label>
							<input
								id="latitude"
								{...register("latitude")}
								required
								placeholder="Latitude"
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2"
							/>
						</div>
						<div>
							<label
								htmlFor="longitude"
								className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
								Longitude (terisi otomatis)
							</label>
							<input
								id="longitude"
								{...register("longitude")}
								required
								placeholder="Longitude"
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2"
							/>
						</div>
						<div>
							<label
								htmlFor="zoom_level"
								className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
								Zoom <span className="text-red-500">*</span>
							</label>
							<input
								id="zoom_level"
								{...register("zoom_level", {
									onChange: (e) =>
										setValue("zoom_level", Number(e.target.value), {
											shouldDirty: true,
										}),
								})}
								type="number"
								min={0}
								max={21}
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2"
							/>
						</div>
					</div>

					<div>
						<label
							htmlFor="place_id"
							className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
							Place ID (opsional)
						</label>
						<input
							id="place_id"
							{...register("place_id")}
							placeholder="Place ID (jika ada)"
							className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2"
						/>
					</div>

					{/* Google Maps Link Parser */}
					<div className="bg-gray-50 border border-gray-100 p-4 rounded">
						<label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
							📍 Opsi 1: Masukkan link Google Maps
						</label>
						<p className="text-xs text-gray-500 mt-1">
							Cara cepat: buka Google Maps, cari lokasi, lalu salin URL dari
							address bar (bukan short link dari dialog Share). URL yang ideal
							berisi salah satu dari pola berikut:{" "}
							<code className="text-xs">@lat,lng,ZZz</code>,
							<code className="text-xs">/place/...</code>, atau parameter query
							seperti <code className="text-xs">q=lat,lng</code>.
						</p>
						<p className="text-xs text-gray-500 mt-2">
							Yang akan otomatis terisi setelah Parse: <strong>latitude</strong>
							,<strong> longitude</strong>, <strong>zoom</strong> (jika
							tersedia), dan <strong>alamat lengkap</strong> (jika dapat
							diekstrak). Field lain seperti <em>kota</em>, <em>provinsi</em>,{" "}
							<em>negara</em>, atau <em>place_id</em> dapat diisi manual jika
							diperlukan.
						</p>
						<div className="flex flex-col sm:flex-row gap-2 mt-2">
							<input
								id="gmap_url"
								value={gmapUrl}
								onChange={(e) => setGmapUrl(e.target.value)}
								placeholder="https://www.google.com/maps/place/... (atau URL dari address bar)"
								className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm"
							/>
							<button
								type="button"
								onClick={handleParse}
								className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-md text-sm">
								Parse
							</button>
						</div>
						{gmapUrl &&
							(gmapUrl.includes("maps.app.goo.gl") ||
								gmapUrl.includes("goo.gl/maps")) && (
								<p className="text-sm text-yellow-600 mt-2">
									Terlihat seperti link pendek Google Maps (maps.app.goo.gl /
									goo.gl/maps). Untuk hasil terbaik, buka halaman Google Maps di
									tab browser dan salin URL dari address bar lalu tempelkan di
									sini sebelum menekan Parse.
								</p>
							)}
						{parseError && (
							<p className="text-sm text-red-600 mt-2 whitespace-pre-wrap">
								{parseError}
							</p>
						)}
					</div>

					{/* Interactive Map Picker */}
					<div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-lg">
						<label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">
							🗺️ Opsi 2: Pilih lokasi di peta
						</label>
						<p className="text-xs text-gray-600 mb-3">
							Cari lokasi, klik peta, atau drag marker untuk menyesuaikan
							posisi. Koordinat akan otomatis diperbarui.
						</p>
						<MapCoordinatePicker
							latitude={getValues("latitude") || -6.2088}
							longitude={getValues("longitude") || 106.8456}
							zoom={getValues("zoom_level") || 15}
							onChange={(lat, lng, zoom, locationData) => {
								setValue("latitude", lat, { shouldDirty: true });
								setValue("longitude", lng, { shouldDirty: true });
								setValue("zoom_level", zoom, { shouldDirty: true });

								// Auto-fill location details from search result
								if (locationData) {
									// Always overwrite when selecting from search
									setValue("nama", locationData.name, { shouldDirty: true });
									setValue("alamat", locationData.address, {
										shouldDirty: true,
									});
									if (locationData.city) {
										setValue("kota", locationData.city, { shouldDirty: true });
									}
									if (locationData.province) {
										setValue("provinsi", locationData.province, {
											shouldDirty: true,
										});
									}
								}
							}}
							className="h-[450px]"
						/>
					</div>

					<div className="mt-auto pt-6">
						<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
							<Button
								type="button"
								variant="outline"
								disabled={isLoading}
								onClick={() => navigate("/organization/locations")}
								className="w-full sm:w-auto order-2 sm:order-1">
								Batal
							</Button>
							<Button
								type="submit"
								variant="success"
								loading={isLoading}
								disabled={isLoading}
								className="w-full sm:w-auto order-1 sm:order-2">
								{isLoading ? "Menyimpan..." : "Simpan Lokasi"}
							</Button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
