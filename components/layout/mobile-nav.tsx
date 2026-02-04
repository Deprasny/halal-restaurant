"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navLinks = [
	{ href: "/dashboard", label: "Dashboard" },
	{ href: "/profile", label: "Profile" },
];

export function MobileNav() {
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();

	return (
		<div className="md:hidden">
			<Button
				variant="ghost"
				size="icon"
				onClick={() => setIsOpen(!isOpen)}
				className="h-10 w-10"
			>
				{isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
			</Button>

			{isOpen && (
				<div className="absolute left-0 right-0 top-16 z-50 border-b border-border bg-background gm-shadow">
					<nav className="container flex flex-col px-4 py-2">
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								onClick={() => setIsOpen(false)}
								className={`px-4 py-3 rounded-md font-medium transition-colors ${
									pathname === link.href
										? "bg-primary text-primary-foreground"
										: "hover:bg-muted"
								}`}
							>
								{link.label}
							</Link>
						))}
					</nav>
				</div>
			)}
		</div>
	);
}

export function DesktopNav() {
	const pathname = usePathname();

	return (
		<nav className="hidden md:flex items-center gap-1">
			{navLinks.map((link) => (
				<Link
					key={link.href}
					href={link.href}
					className={`px-4 py-2 rounded-md font-medium transition-colors ${
						pathname === link.href
							? "bg-primary text-primary-foreground"
							: "hover:bg-muted"
					}`}
				>
					{link.label}
				</Link>
			))}
		</nav>
	);
}
