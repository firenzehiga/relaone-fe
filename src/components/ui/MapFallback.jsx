import { MapPin, ExternalLink, Navigation, Copy } from "lucide-react";
import Button from "@/components/ui/Button";

export default function MapFallback({
	latitude,
	longitude,
	location,
	address,
	className = "",
	showActions = true,
	size = "md", // sm, md, lg
}) {
	const coordinates = `${latitude}, ${longitude}`;

	const getGoogleMapsUrl = () => {
		return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
	};

	const getDirectionsUrl = () => {
		return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
	};

	const copyCoordinates = () => {
		navigator.clipboard.writeText(coordinates);
	};

	const sizeClasses = {
		sm: "h-32",
		md: "h-48",
		lg: "h-64",
	};

	return (
		<div
			className={`bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg ${sizeClasses[size]} flex flex-col items-center justify-center relative ${className}`}>
			<div className="text-center p-4">
				<div className="bg-white rounded-full p-3 shadow-sm mb-3 inline-flex">
					<MapPin
						size={size === "sm" ? 20 : size === "lg" ? 36 : 28}
						className="text-blue-600"
					/>
				</div>

				{location && (
					<h4
						className={`font-semibold text-gray-900 mb-1 ${
							size === "sm" ? "text-sm" : "text-base"
						}`}>
						{location}
					</h4>
				)}

				<p
					className={`text-gray-600 mb-2 ${
						size === "sm" ? "text-xs" : "text-sm"
					}`}>
					{address || coordinates}
				</p>

				{showActions && (
					<div className="flex gap-2 justify-center flex-wrap">
						<Button
							variant="primary"
							size={size === "sm" ? "xs" : "sm"}
							onClick={() => window.open(getGoogleMapsUrl(), "_blank")}
							className="flex items-center gap-1">
							<ExternalLink size={size === "sm" ? 12 : 14} />
							{size === "sm" ? "Maps" : "Buka di Maps"}
						</Button>

						<Button
							variant="outline"
							size={size === "sm" ? "xs" : "sm"}
							onClick={() => window.open(getDirectionsUrl(), "_blank")}
							className="flex items-center gap-1">
							<Navigation size={size === "sm" ? 12 : 14} />
							{size === "sm" ? "Rute" : "Petunjuk Arah"}
						</Button>

						{size !== "sm" && (
							<Button
								variant="ghost"
								size="sm"
								onClick={copyCoordinates}
								className="flex items-center gap-1">
								<Copy size={14} />
								Copy Koordinat
							</Button>
						)}
					</div>
				)}
			</div>

			{/* Background pattern */}
			<div className="absolute inset-0 opacity-10">
				<div className="absolute top-2 left-2 w-2 h-2 bg-blue-400 rounded-full"></div>
				<div className="absolute top-4 right-6 w-1 h-1 bg-purple-400 rounded-full"></div>
				<div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
				<div className="absolute bottom-3 right-3 w-2 h-2 bg-purple-400 rounded-full"></div>
			</div>
		</div>
	);
}
