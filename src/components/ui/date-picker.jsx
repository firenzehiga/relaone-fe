"use client";

import { useEffect, useState } from "react";
import { ChevronDownIcon, CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Reusable DatePicker component
export function DatePicker({
	value,
	onChange,
	placeholder = "Pilih tanggal",
	disabled = false,
	id = "date-picker",
	className = "",
	buttonClassName = "",
}) {
	const [open, setOpen] = useState(false);
	const [date, setDate] = useState(value || undefined);
	const [month, setMonth] = useState(value || new Date());

	// Sync with external value changes
	useEffect(() => {
		setDate(value || undefined);
		if (value) {
			setMonth(value);
		}
	}, [value]);

	const handleDateSelect = (selected) => {
		setDate(selected);
		setOpen(false);
		if (onChange) {
			onChange(selected);
		}
	};

	return (
		<div className={`relative ${className}`}>
			<CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						type="button"
						variant="outline"
						id={id}
						disabled={disabled}
						className={`w-full justify-between font-normal pl-10 text-left ${buttonClassName}`}>
						<span>{date ? date.toLocaleDateString("id-ID") : placeholder}</span>
						<ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto overflow-hidden p-0" align="start">
					<Calendar
						mode="single"
						selected={date}
						month={month}
						onMonthChange={setMonth}
						defaultMonth={date || new Date()}
						captionLayout="dropdown"
						onSelect={handleDateSelect}
						disabled={disabled}
						fromYear={1950}
						toYear={new Date().getFullYear() + 10}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}

// Legacy example component
export function Calendar28() {
	const [date, setDate] = useState(new Date("2025-06-01"));

	return (
		<div>
			<label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Berlangganan</label>
			<DatePicker value={date} onChange={setDate} placeholder="Pilih tanggal" />
		</div>
	);
}
