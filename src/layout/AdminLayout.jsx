import { Outlet } from "react-router-dom";
import AdminHeader from "@/components/layout/admin/AdminHeader";
import AdminFooter from "@/components/layout/admin/AdminFooter";

export default function AdminLayout() {
	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50">
			<AdminHeader />
			<Outlet />
			<AdminFooter />
		</div>
	);
}
