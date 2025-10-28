import { Outlet } from "react-router-dom";
import AdminHeader from "@/components/layout/admin/AdminHeader";
import AdminFooter from "@/components/layout/admin/AdminFooter";

export default function AdminLayout() {
	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-100 via-blue-50 to-blue-100">
			<AdminHeader />
			<Outlet />
			<AdminFooter />
		</div>
	);
}
