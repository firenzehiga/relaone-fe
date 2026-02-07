import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import {
	Heart,
	Home,
	Calendar,
	Building,
	User2,
	Users,
	MapPin,
	SwatchBook,
} from "lucide-react";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/_hooks/useAuth";

// Data navigasi admin
const adminNavData = {
	navMain: [
		{
			title: "Dashboard",
			url: "/admin/dashboard",
			icon: Home,
		},
		{
			title: "Users",
			url: "/admin/users",
			icon: User2,
		},
		{
			title: "Organizations",
			url: "/admin/organizations",
			icon: Building,
		},
		{
			title: "Manage Events",
			url: "#",
			icon: Calendar,
			items: [
				{
					title: "Events",
					url: "/admin/events",
					icon: Calendar,
				},
				{
					title: "Participants",
					url: "/admin/event-participants",
					icon: Users,
				},
				{
					title: "Locations",
					url: "/admin/locations",
					icon: MapPin,
				},
				{
					title: "Categories",
					url: "/admin/categories",
					icon: SwatchBook,
				},
			],
		},
		{
			title: "Feedbacks",
			url: "/admin/feedbacks",
			icon: Heart,
		},
	],
};

export function AdminSidebar({ ...props }) {
	const location = useLocation();
	const { user } = useAuthStore();

	const isActive = (path) => {
		return location.pathname === path;
	};

	const isSubMenuActive = (items) => {
		return items?.some((item) => isActive(item.url));
	};

	return (
		<Sidebar {...props}>
			<SidebarHeader className="border-b border-sidebar-border">
				<Link
					to="/admin/dashboard"
					className="flex items-center space-x-2 px-2 py-3 group">
					<img
						src="/images/logo_fe.png"
						alt="RelaOne Logo"
						className="w-8 h-8"
					/>
					<div className="flex flex-col">
						<span className="text-lg font-bold text-sidebar-foreground">
							Admin Rela
							<span className="text-emerald-600">O</span>
							ne
						</span>
						<span className="text-xs text-sidebar-muted-foreground">
							Management Panel
						</span>
					</div>
				</Link>
			</SidebarHeader>

			<SidebarContent className="gap-0">
				{adminNavData.navMain.map((item) => {
					if (item.items) {
						// Menu dengan submenu
						const hasActiveSubItem = isSubMenuActive(item.items);
						return (
							<Collapsible
								key={item.title}
								title={item.title}
								defaultOpen={hasActiveSubItem}
								className="group/collapsible">
								<SidebarGroup>
									<SidebarGroupLabel
										asChild
										className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
										<CollapsibleTrigger className="flex items-center gap-2 w-full">
											<item.icon className="h-4 w-4" />
											{item.title}
											<ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
										</CollapsibleTrigger>
									</SidebarGroupLabel>
									<CollapsibleContent>
										<SidebarGroupContent>
											<SidebarMenu>
												{item.items.map((subItem) => (
													<SidebarMenuItem key={subItem.title}>
														<SidebarMenuButton
															asChild
															isActive={isActive(subItem.url)}>
															<Link
																to={subItem.url}
																className="flex items-center gap-2">
																<subItem.icon className="h-4 w-4" />
																{subItem.title}
															</Link>
														</SidebarMenuButton>
													</SidebarMenuItem>
												))}
											</SidebarMenu>
										</SidebarGroupContent>
									</CollapsibleContent>
								</SidebarGroup>
							</Collapsible>
						);
					} else {
						// Menu tanpa submenu
						return (
							<SidebarGroup key={item.title}>
								<SidebarGroupContent>
									<SidebarMenu>
										<SidebarMenuItem>
											<SidebarMenuButton asChild isActive={isActive(item.url)}>
												<Link to={item.url} className="flex items-center gap-2">
													<item.icon className="h-4 w-4" />
													{item.title}
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									</SidebarMenu>
								</SidebarGroupContent>
							</SidebarGroup>
						);
					}
				})}
			</SidebarContent>

			<SidebarFooter className="border-t border-sidebar-border">
				<div className="px-2 py-3 text-center">
					<div className="text-xs text-sidebar-muted-foreground">
						Admin Panel v2.0
					</div>
				</div>
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	);
}
