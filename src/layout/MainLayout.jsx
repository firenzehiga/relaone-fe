import { Outlet } from "react-router-dom";
import Header from "@/components/layout/volunteer/Header";
import Footer from "@/components/layout/volunteer/Footer";
import { useUserRole } from "@/_hooks/useAuth";
import AdminFooter from "@/components/layout/admin/AdminFooter";

export default function MainLayout() {
	const currentRole = useUserRole();

	return (
		<div className="flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50">
			<Header />
			<Outlet />
			{currentRole === "organization" ? <AdminFooter /> : <Footer />}
		</div>
	);
}
