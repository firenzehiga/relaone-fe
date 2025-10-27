import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils";

export default function Tabs({
	children,
	defaultValue,
	className,
	onValueChange,
}) {
	const [activeTab, setActiveTab] = useState(defaultValue);

	const handleTabChange = (value) => {
		setActiveTab(value);
		onValueChange?.(value);
	};

	return (
		<div className={cn("", className)}>
			{children({ activeTab, setActiveTab: handleTabChange })}
		</div>
	);
}

function TabsList({ children, className }) {
	return (
		<div className={cn("flex border-b border-gray-700", className)}>
			{children}
		</div>
	);
}

const TabsTrigger = ({
	value,
	children,
	activeTab,
	setActiveTab,
	className,
}) => {
	const isActive = value === activeTab;
	const MotionButton = motion.button;

	return (
		<MotionButton
			whileHover={{ y: -1 }}
			whileTap={{ y: 0 }}
			onClick={() => setActiveTab(value)}
			className={cn(
				"px-4 py-2 text-sm font-medium transition-colors relative",
				isActive
					? "text-blue-400 border-b-2 border-blue-400"
					: "text-gray-400 hover:text-gray-200",
				className
			)}>
			{children}
		</MotionButton>
	);
};

function TabsContent({ value, children, activeTab, className }) {
	if (value !== activeTab) return null;

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.2 }}
			className={cn("mt-4", className)}>
			{children}
		</motion.div>
	);
}

Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;
