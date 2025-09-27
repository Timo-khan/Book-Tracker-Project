"use client";

import React, { useState, useRef, useEffect } from "react";
import "./CustomDropdown.css";

interface CustomDropdownProps {
	options: { value: string; label: string }[];
	placeholder?: string;
	onChange: (value: string) => void;
}

export default function CustomDropdown({
	options,
	placeholder = "Select...",
	onChange,
}: CustomDropdownProps) {
	const [open, setOpen] = useState(false);
	const [selected, setSelected] = useState<string>("");
	const dropdownRef = useRef<HTMLDivElement>(null);

	const handleSelect = (value: string) => {
		setSelected(value);
		setOpen(false);
		onChange(value);
	};

	// Close dropdown on outside click
	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(e.target as Node)
			) {
				setOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className="dropdown" ref={dropdownRef}>
			<div className="dropdown-header" onClick={() => setOpen(!open)}>
				{selected
					? options.find((opt) => opt.value === selected)?.label
					: placeholder}
				<span className="arrow">{open ? "▲" : "▼"}</span>
			</div>
			{open && (
				<ul className="dropdown-list">
					{options.map((opt) => (
						<li
							key={opt.value}
							className="dropdown-item"
							onClick={() => handleSelect(opt.value)}
						>
							{opt.label}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
