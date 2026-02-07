import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Building, Calendar, Users, MapPin, MessageSquare } from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/_hooks/useAuth";

// Data navigasi organisasi
const getOrganizationNavData = (orgStatus) => {
	const baseNavData = {
		navMain: [
			{
				title: "Dashboard",
				url: "/organization/dashboard",
				icon: Building,
			},
		],
	};

	// Jika organisasi belum verified, hanya tampilkan Dashboard
	if (orgStatus !== "verified") {
		return baseNavData;
	}

	// Jika sudah verified, tampilkan semua menu
	return {
		navMain: [
			{
				title: "Dashboard",
				url: "/organization/dashboard",
				icon: Building,
			},
			{
				title: "Events",
				url: "/organization/events",
				icon: Calendar,
			},
			{
				title: "Event Participants",
				url: "/organization/event-participants",
				icon: Users,
			},
			{
				title: "Feedbacks",
				url: "/organization/feedbacks",
				icon: MessageSquare,
			},
			{
				title: "Locations",
				url: "/organization/locations",
				icon: MapPin,
			},
		],
	};
};

export function OrganizationSidebar({ ...props }) {
	const location = useLocation();
	const { user } = useAuthStore();

	// Get organization status
	const orgStatus = user?.organization?.status_verifikasi;
	const organizationNavData = getOrganizationNavData(orgStatus);

	const isActive = (path) => {
		return location.pathname === path;
	};

	return (
		<Sidebar {...props}>
			<SidebarHeader className="border-b border-sidebar-border">
				<Link
					to="/organization/dashboard"
					className="flex items-center space-x-2 px-2 py-3 group">
					<img
						src="/images/logo_fe.png"
						alt="RelaOne Logo"
						className="w-8 h-8"
					/>
					<div className="flex flex-col">
						<span className="text-lg font-bold text-sidebar-foreground">
							Rela
							<span className="text-emerald-600">O</span>
							ne
						</span>
						<span className="text-xs text-sidebar-muted-foreground">
							{orgStatus === "verified"
								? "Organization Panel"
								: "Pending Verification"}
						</span>
					</div>
				</Link>
			</SidebarHeader>

			<SidebarContent className="gap-0">
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{organizationNavData.navMain.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild isActive={isActive(item.url)}>
										<Link to={item.url} className="flex items-center gap-2">
											<item.icon className="h-4 w-4" />
											{item.title}
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				{/* Show verification status if pending */}
				{orgStatus !== "verified" && (
					<SidebarGroup>
						<SidebarGroupContent>
							<div className="px-2 py-3 text-center">
								<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
									<div className="text-xs font-medium text-yellow-800 mb-1">
										Status Verifikasi
									</div>
									<div className="text-xs text-yellow-600 capitalize">
										{orgStatus === "pending"
											? "Menunggu Persetujuan"
											: orgStatus === "rejected"
												? "Ditolak"
												: orgStatus}
									</div>
								</div>
							</div>
						</SidebarGroupContent>
					</SidebarGroup>
				)}
			</SidebarContent>

			<SidebarFooter className="border-t border-sidebar-border">
				<div className="px-2 py-3 text-center">
					<div className="text-xs text-sidebar-muted-foreground">
						Organization Panel v2.0
					</div>
				</div>
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	);
}
