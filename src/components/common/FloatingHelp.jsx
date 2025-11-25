import { HelpCircle, Phone, Mail } from "lucide-react";

/**
 * FloatingHelp
 * - Floating circular button at bottom-left.
 * - On hover expands a small vertical menu above the button (to the right).
 * - Defaults can be customized via props.
 */
export default function FloatingHelp({
	whatsapp = "085894310722",
	email = "relaonevolunteer@gmail.com",
}) {
	const waHref = `https://wa.me/${whatsapp}`;
	const mailHref = `mailto:${email}`;

	return (
		<div className="fixed bottom-6 left-6 z-50">
			{/* group wrapper to control hover */}
			<div className="group relative flex items-end">
				{/* Main floating button (left side) */}
				<button
					aria-label="Bantuan"
					className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xl flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-emerald-300">
					<HelpCircle className="w-6 h-6" />
				</button>

				{/* Hidden action buttons, appear on hover (to the right of the button) */}
				<div className="flex flex-col items-start mb-3 ml-3 space-y-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
					<a
						href={waHref}
						target="_blank"
						rel="noreferrer"
						className="flex items-center space-x-3 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg shadow-lg text-sm">
						<span className="p-2 bg-white bg-opacity-10 rounded-full">
							<Phone className="w-4 h-4" />
						</span>
						<span>Chat WhatsApp</span>
					</a>

					<a
						href={mailHref}
						className="flex items-center space-x-3 bg-slate-700 hover:bg-slate-800 text-white px-3 py-2 rounded-lg shadow-lg text-sm">
						<span className="p-2 bg-white bg-opacity-10 rounded-full">
							<Mail className="w-4 h-4" />
						</span>
						<span>Kirim Email</span>
					</a>
				</div>
			</div>
		</div>
	);
}
