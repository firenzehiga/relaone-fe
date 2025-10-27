import { useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import {
	ChevronDown,
	Plus,
	Loader2,
	Trash,
	PencilIcon,
	EllipsisVerticalIcon,
	Eye,
	EditIcon,
} from "lucide-react";
import DynamicButton, { LinkButton } from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import {
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Portal,
	IconButton,
} from "@chakra-ui/react";
import {
	useAdminCategory,
	useAdminDeleteCategory,
} from "@/_hooks/useCategories";

export default function AdminCategory() {
	const {
		data: categories,
		isLoading: categoriesLoading,
		error: categoriesError,
	} = useAdminCategory();

	const deleteCategoryMutation = useAdminDeleteCategory();

	// Local state for search/filter
	const [searchCategory, setSearchCategory] = useState("");

	const filteredCategories = useMemo(() => {
		if (!searchCategory) return categories;
		const query = searchCategory.toLowerCase();
		return categories.filter((categoryItem) => {
			const nama = String(categoryItem.nama || "").toLowerCase();
			const deskripsi = String(categoryItem.deskripsi || "").toLowerCase();
			return nama.includes(query) || deskripsi.includes(query);
		});
	}, [categories, searchCategory]);

	const columns = [
		{
			name: "No",
			cell: (row, index) => index + 1,
			sortable: false,
			width: "60px",
		},
		{
			name: "Kategori",
			selector: (row) => <Badge color={row.warna}>{row.nama}</Badge> || "-",
			sortable: true,
			wrap: true,
			width: "220px",
		},
		{
			name: "Deskripsi",
			selector: (row) => row.deskripsi || "-",
			sortable: true,
			wrap: true,
		},
		{
			name: "Status",
			selector: (row) => (
				<>
					{row.is_active === true ? (
						<Badge variant={"success"}>Aktif</Badge>
					) : (
						<Badge variant={"danger"}>Tidak Aktif</Badge>
					)}
				</>
			),
			sortable: true,
			width: "120px",
		},
		{
			name: "Aksi",
			cell: (row) => (
				<Menu>
					<MenuButton
						as={IconButton}
						aria-label="Options"
						icon={<EllipsisVerticalIcon />}
						variant="ghost"
					/>
					<Portal>
						<MenuList className="font-semibold">
							<MenuItem
								icon={<Eye className="text-blue-500 hover:text-blue-600" />}>
								Lihat
							</MenuItem>
							<MenuItem
								icon={
									<EditIcon className="text-yellow-500 hover:text-yellow-600" />
								}>
								Edit
							</MenuItem>
							<MenuItem
								onClick={() => handleDelete(row.id)}
								disabled={deleteCategoryMutation.isLoading}
								icon={<Trash className="text-red-500 hover:text-red-600" />}>
								Hapus
							</MenuItem>
						</MenuList>
					</Portal>
				</Menu>
			),
			width: "140px",
		},
	];

	return (
		<div className="py-8 page-transition">
			<div className="max-w-6xl mx-auto px-4">
				<div className="mb-6">
					<h1 className="text-lg md:text-2xl font-bold text-gray-900 sm:text-md">
						Data Kategori
					</h1>
					<p className="text-sm md:text-base text-gray-600">
						Kelola data kategori di sini
					</p>
				</div>

				<div className="bg-white rounded-lg shadow p-4 sm:p-6">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-base md:text-lg font-semibold">
							Daftar Kategori
						</h2>
						<LinkButton
							to="/admin/categories/create"
							variant="success"
							size="sm">
							<Plus className="w-4 h-4 mr-2" /> Tambah Kategori
						</LinkButton>
					</div>

					{categoriesLoading ? (
						<div className="flex h-72 md:h-96 justify-center py-20">
							<Loader2 className="animate-spin h-6 w-6 md:h-7 md:w-7 text-emerald-600" />
						</div>
					) : categoriesError ? (
						<div className="text-red-600 text-sm">
							Error loading categories: {categoriesError.message}
						</div>
					) : categories.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-48 text-gray-600">
							<h3 className="text-base md:text-lg font-semibold mb-2">
								No categories Available
							</h3>
							<p className="text-sm md:text-base">Belum ada data kategori.</p>
						</div>
					) : (
						<>
							<div className="w-full md:w-80 mb-4">
								<input
									type="text"
									placeholder="Cari jenis kategori, atau deskripsi..."
									value={searchCategory}
									onChange={(e) => setSearchCategory(e.target.value)}
									className="border border-gray-300 rounded-md px-3 py-2 text-sm md:text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
								/>
							</div>
							<DataTable
								columns={columns}
								data={filteredCategories}
								pagination
								pointerOnHover
								title=""
								highlightOnHover
								persistTableHead
								responsive
								fixedHeader
								striped
								sortIcon={<ChevronDown />}
								expandableRows
								expandableRowsComponent={({ data }) => (
									<div className="p-3 md:p-4 bg-gray-50 rounded-md text-sm md:text-base">
										<p className="text-sm text-gray-600">
											<strong>Alamat:</strong> {data?.alamat || "-"}
										</p>
										<p className="text-sm text-gray-600 mt-2">
											<strong>No Telepon:</strong>
										</p>
										<p className="text-sm text-gray-800 mt-1">
											{data.telepon || "-"}
										</p>
										<p className="text-sm text-gray-600 mt-2">
											<strong>Tanggal Lahir:</strong>
										</p>
										<p className="text-sm text-gray-800 mt-1">
											{data.tanggal_lahir
												? new Date(
														data.tanggal_lahir.replace(" ", "T")
												  ).toLocaleDateString("id-ID", {
														day: "numeric",
														month: "long",
														year: "numeric",
												  })
												: "-"}
										</p>
										<p className="text-sm text-gray-600 mt-2">
											<strong>Jenis Kelamin:</strong>
										</p>
										{data.jenis_kelamin === "laki-laki" ? (
											<p className="text-sm text-gray-800 mt-1">Laki-laki</p>
										) : data.jenis_kelamin === "perempuan" ? (
											<p className="text-sm text-gray-800 mt-1">Perempuan</p>
										) : (
											<p className="text-sm text-gray-800 mt-1">-</p>
										)}
									</div>
								)}
							/>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
