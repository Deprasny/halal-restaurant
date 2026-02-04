"use client";

import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	debounceMs?: number;
}

export function SearchInput({
	value,
	onChange,
	placeholder = "Search restaurants...",
	debounceMs = 500,
}: SearchInputProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [localValue, setLocalValue] = useState(value);

	useEffect(() => {
		setLocalValue(value);
	}, [value]);

	useEffect(() => {
		const timer = setTimeout(() => {
			if (localValue !== value) {
				onChange(localValue);
			}
		}, debounceMs);

		return () => clearTimeout(timer);
	}, [localValue, value, onChange, debounceMs]);

	return (
		<div className="relative">
			<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
			<Input
				ref={inputRef}
				type="text"
				value={localValue}
				onChange={(e) => setLocalValue(e.target.value)}
				placeholder={placeholder}
				className="pl-10 pr-10 h-10 rounded-full bg-muted border-0 text-sm focus-visible:ring-1 focus-visible:ring-primary"
			/>
			{localValue && (
				<button
					type="button"
					onClick={() => {
						setLocalValue("");
						onChange("");
						inputRef.current?.focus();
					}}
					className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-background rounded-full"
				>
					<X className="h-4 w-4" />
				</button>
			)}
		</div>
	);
}
