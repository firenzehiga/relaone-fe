import { useAuthStore } from "@/_hooks/useAuth";
import { useOrgCreateLocationMutation } from "@/_hooks/useLocations";
import DynamicButton from "@/components/ui/Button";
import { parseApiError, parseGoogleMapsUrl } from "@/utils";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
// import { useOrgOrganizations } from "@/_hooks/useOrganizations";
import Skeleton from "@/components/ui/Skeleton";

export default function OrganizationLocationCreate() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
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
	});
	const { isLoading } = useAuthStore();
	const [gmapUrl, setGmapUrl] = useState("");
	const [parseError, setParseError] = useState("");

	const createLocationMutation = useOrgCreateLocationMutation();

	// Generic change handler
	const handleChange = (e) => {
		const { name, value } = e.target;
		// keep numeric zoom as number
		if (name === "zoom_level") {
			setFormData((s) => ({ ...s, [name]: Number(value) }));
		} else {
			setFormData((s) => ({ ...s, [name]: value }));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setParseError("");

		const payload = new FormData();
		for (const key in formData) {
			payload.append(key, formData[key]);
		}

		await createLocationMutation.mutateAsync(payload);
	};

	const handleParse = () => {
		setParseError("");
		const result = parseGoogleMapsUrl(gmapUrl);
		if (!result) {
			setParseError(
				"Tidak dapat mem-parsing URL. Pastikan Anda menempelkan link share Google Maps (bukan URL pendek).\nCoba gunakan opsi 'Share' pada Google Maps → 'Copy link'."
			);
			return;
		}

		setFormData((s) => ({
			...s,
			latitude: result.latitude || s.latitude,
			longitude: result.longitude || s.longitude,
			zoom_level: result.zoom_level || s.zoom_level,
			alamat: result.place || s.alamat,
			// auto-fill nama hanya jika belum ada (user tetap bisa edit)
			nama: result.place,
		}));
	};

	if (organizationsLoading) {
		return <Skeleton.FormSkeleton title="Loading..." />;
	}

	return (
		<div className="max-w-6xl mx-auto p-6">
			<div
				className="bg-white shadow-lg rounded-lg p-6"
				style={{ minHeight: 420, width: 900 }}>
				<header className="mb-6">
					<h1 className="text-2xl font-semibold text-gray-900">
						Buat Lokasi Baru
					</h1>
					<p className="text-sm text-gray-500 mt-1">
						Isi detail lokasi. Anda bisa menempelkan link Google Maps dan
						menekan "Parse" untuk mengisi koordinat otomatis.
					</p>
				</header>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Nama Lokasi (bebas, hanya untuk pendataan){" "}
								<span className="text-red-500">*</span>
							</label>
							<input
								name="nama"
								value={formData.nama}
								onChange={handleChange}
								type="text"
								required
								placeholder="Contoh: Lapangan RW 05"
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">
								Tipe Lokasi <span className="text-red-500">*</span>
							</label>
							<select
								name="tipe"
								id="tipe"
								value={formData.tipe}
								onChange={handleChange}
								required
								className="mt-1 block w-full rounded-md border border-gray-200 px-2 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
								<option value="">Pilih tipe</option>
								<option value="event">Event</option>
								<option value="organization">Kantor</option>
							</select>
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Alamat <span className="text-red-500">*</span>
							</label>
							<input
								name="alamat"
								value={formData.alamat}
								onChange={handleChange}
								type="text"
								required
								placeholder="Alamat (terisi otomatis dari Google Maps)"
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
							/>
						</div>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Alamat Tambahan
						</label>
						<input
							name="alamat_lengkap"
							value={formData.alamat_lengkap}
							onChange={handleChange}
							type="text"
							placeholder="Alamat lengkap (opsional)"
							className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Kota (opsional)
							</label>
							<input
								name="kota"
								value={formData.kota}
								onChange={handleChange}
								placeholder="Kota (opsional)"
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Provinsi (opsional)
							</label>
							<input
								name="provinsi"
								value={formData.provinsi}
								onChange={handleChange}
								placeholder="Provinsi (opsional)"
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Negara <span className="text-red-500">*</span>
							</label>
							<input
								name="negara"
								value={formData.negara}
								onChange={handleChange}
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2"
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Latitude (terisi otomatis)
							</label>
							<input
								name="latitude"
								value={formData.latitude}
								onChange={handleChange}
								required
								placeholder="Latitude"
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Longitude (terisi otomatis)
							</label>
							<input
								name="longitude"
								value={formData.longitude}
								onChange={handleChange}
								required
								placeholder="Longitude"
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Zoom <span className="text-red-500">*</span>
							</label>
							<input
								name="zoom_level"
								value={formData.zoom_level}
								onChange={handleChange}
								type="number"
								min={0}
								max={21}
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2"
							/>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">
							Place ID (opsional)
						</label>
						<input
							name="place_id"
							value={formData.place_id}
							onChange={handleChange}
							placeholder="Place ID (jika ada)"
							className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2"
						/>
					</div>

					<div className="bg-gray-50 border border-gray-100 p-4 rounded">
						<label className="block text-sm font-medium text-gray-700">
							Masukkan link Google Maps
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
						<div className="flex gap-2 mt-2">
							<input
								value={gmapUrl}
								onChange={(e) => setGmapUrl(e.target.value)}
								placeholder="https://www.google.com/maps/place/... (atau URL dari address bar)"
								className="flex-1 rounded-md border border-gray-200 px-3 py-2"
							/>
							<button
								type="button"
								onClick={handleParse}
								className="px-4 py-2 bg-indigo-600 text-white rounded-md">
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

					<div className="flex items-center justify-end gap-3">
						<Button
							type="button"
							variant="outline"
							disabled={isLoading}
							onClick={() => navigate("/organization/locations")}>
							Batal
						</Button>
						<Button
							type="submit"
							variant="success"
							loading={isLoading}
							disabled={isLoading}>
							{isLoading ? "Membuat..." : "Buat Lokasi"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
