import { useLocation } from "react-router-dom";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Mapping path ke breadcrumb data
const breadcrumbMap = {
	// Admin routes
	"/admin/dashboard": { title: "Dashboard", parent: "Admin Panel" },
	"/admin/users": { title: "Users", parent: "Admin Panel" },
	"/admin/organizations": { title: "Organizations", parent: "Admin Panel" },
	"/admin/events": { title: "Events", parent: "Admin Panel" },
	"/admin/event-participants": {
		title: "Event Participants",
		parent: "Admin Panel",
	},
	"/admin/locations": { title: "Locations", parent: "Admin Panel" },
	"/admin/categories": { title: "Categories", parent: "Admin Panel" },
	"/admin/feedbacks": { title: "Feedbacks", parent: "Admin Panel" },

	// Organization routes
	"/organization/dashboard": {
		title: "Dashboard",
		parent: "Organization Panel",
	},
	"/organization/events": { title: "Events", parent: "Organization Panel" },
	"/organization/event-participants": {
		title: "Event Participants",
		parent: "Organization Panel",
	},
	"/organization/feedbacks": {
		title: "Feedbacks",
		parent: "Organization Panel",
	},
	"/organization/locations": {
		title: "Locations",
		parent: "Organization Panel",
	},
	"/organization/profile": { title: "Profile", parent: "Organization Panel" },
};

export function DynamicBreadcrumb() {
	const location = useLocation();
	const pathname = location.pathname;

	// Cek apakah ada exact match
	let breadcrumbData = breadcrumbMap[pathname];

	// Jika tidak ada exact match, coba cari parent path untuk create/edit pages
	if (!breadcrumbData) {
		const segments = pathname.split("/");
		const action = segments[segments.length - 1];

		if (action === "create") {
			// Remove last segment to get parent path
			const parentPath = segments.slice(0, -1).join("/");
			const parentData = breadcrumbMap[parentPath];
			if (parentData) {
				breadcrumbData = {
					title: `Create ${parentData.title}`,
					parent: parentData.parent,
				};
			}
		} else if (action === "edit" || segments[segments.length - 2] === "edit") {
			// Remove last 2 segments for edit with ID
			const parentPath = segments
				.slice(0, segments.includes("edit") ? -2 : -1)
				.join("/");
			const parentData = breadcrumbMap[parentPath];
			if (parentData) {
				breadcrumbData = {
					title: `Edit ${parentData.title}`,
					parent: parentData.parent,
				};
			}
		}
	}

	// Default fallback
	if (!breadcrumbData) {
		const isAdmin = pathname.startsWith("/admin");
		const isOrganization = pathname.startsWith("/organization");

		breadcrumbData = {
			title: "Page",
			parent: isAdmin
				? "Admin Panel"
				: isOrganization
					? "Organization Panel"
					: "Dashboard",
		};
	}

	const dashboardLink = pathname.startsWith("/admin")
		? "/admin/dashboard"
		: "/organization/dashboard";

	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem className="hidden md:block font-medium">
					<BreadcrumbLink href={dashboardLink}>
						{breadcrumbData.parent}
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator className="hidden md:block " />
				<BreadcrumbItem>
					<BreadcrumbPage className="font-medium">
						{breadcrumbData.title}
					</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	);
}
