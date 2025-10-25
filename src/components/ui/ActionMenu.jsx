import { useState, useEffect, useRef } from "react";
import { MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";

export default function ActionMenu({
	items = [],
	triggerClass = "p-2 rounded-full hover:bg-gray-100 focus:outline-none",
	menuClass = "absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg z-50 py-1",
	className = "relative",
}) {
	const [open, setOpen] = useState(false);
	const rootRef = useRef(null);

	useEffect(() => {
		function handleDoc(e) {
			if (!rootRef.current) return;
			if (!rootRef.current.contains(e.target)) setOpen(false);
		}
		document.addEventListener("mousedown", handleDoc);
		return () => document.removeEventListener("mousedown", handleDoc);
	}, []);

	return (
		<div ref={rootRef} className={className}>
			<button
				type="button"
				className={triggerClass}
				onClick={(e) => {
					e.stopPropagation();
					setOpen((v) => !v);
				}}
				aria-haspopup="true"
				aria-expanded={open}>
				<MoreVertical className="w-5 h-5 text-gray-600" />
			</button>

			{open && (
				<div className={menuClass} role="menu">
					{items.map((it, idx) => {
						const Icon = it.icon;
						const content = (
							<span className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
								{Icon ? (
									<Icon
										className={`w-4 h-4 mr-2 ${
											it.danger ? "text-red-600" : "text-gray-700"
										}`}
									/>
								) : null}
								{it.label}
							</span>
						);

						if (it.href) {
							return (
								<Link
									key={idx}
									to={it.href}
									className="block"
									onClick={(e) => {
										if (it.onClick) it.onClick(e);
										setOpen(false);
									}}>
									{content}
								</Link>
							);
						}

						return (
							<button
								key={idx}
								type="button"
								className="block w-full text-left"
								onClick={(e) => {
									e.stopPropagation();
									if (it.onClick) it.onClick(e);
									setOpen(false);
								}}>
								{content}
							</button>
						);
					})}
				</div>
			)}
		</div>
	);
}
