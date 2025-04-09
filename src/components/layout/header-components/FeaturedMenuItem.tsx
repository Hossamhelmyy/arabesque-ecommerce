import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FeaturedMenuItemProps {
	href: string;
	label: string;
}

export const FeaturedMenuItem = ({
	href,
	label,
}: FeaturedMenuItemProps) => {
	return (
		<Button
			variant="ghost"
			asChild
			className="justify-center h-auto py-2 px-3">
			<Link
				to={href}
				className={cn(
					"block select-none space-y-1 rounded-md leading-none no-underline outline-none",
				)}>
				<div className="text-sm font-medium leading-none">
					{label}
				</div>
			</Link>
		</Button>
	);
};

export default FeaturedMenuItem;
