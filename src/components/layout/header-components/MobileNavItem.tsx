import React from "react";
import { Badge } from "@/components/ui/badge";

export interface NavItemProps {
	href: string;
	icon: React.ReactNode;
	label: string;
	badge?: number;
	onClick?: () => void;
	className?: string;
}

export const MobileNavItem = ({
	icon,
	label,
	badge,
	onClick,
	className = "",
}: NavItemProps) => {
	return (
		<button
			onClick={onClick}
			className={`admin-sidebar-item group relative admin-sidebar-item-inactive sidebar-hover-effect w-full text-start ${className}`}>
			{icon}
			<span>{label}</span>
			{badge && badge > 0 && (
				<Badge
					variant="secondary"
					className="absolute right-2">
					{badge}
				</Badge>
			)}
		</button>
	);
};

export default MobileNavItem;
