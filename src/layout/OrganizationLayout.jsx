import { Outlet } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { OrganizationSidebar } from "@/components/layout/organization/OrganizationSidebar";
import { DynamicBreadcrumb } from "@/components/layout/DynamicBreadcrumb";
import { UserMenu } from "@/components/layout/UserMenu";

export default function OrganizationLayout() {
	return (
		<SidebarProvider>
			<OrganizationSidebar />
			<SidebarInset>
				<header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4 z-40">
					<SidebarTrigger className="-ml-1" />
					<Separator orientation="vertical" className="mr-2 h-4" />
					<DynamicBreadcrumb />
					<UserMenu />
				</header>
				<div className="flex flex-1 flex-col min-h-[calc(100vh-4rem)] bg-emerald-50 pt-4">
					<div className="flex-1 px-4 sm:px-6 lg:px-8">
						<Outlet />
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
