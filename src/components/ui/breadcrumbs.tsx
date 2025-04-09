import { useTranslation } from "react-i18next";
import { Breadcrumb } from "@/components/ui/breadcrumb";

interface BreadcrumbsProps {
	items: {
		href: string;
		label?: string;
		translationKey?: string;
	}[];
	homeLink?: boolean;
	className?: string;
}

export function Breadcrumbs({
	items,
	homeLink = true,
	className,
}: BreadcrumbsProps) {
	const { t } = useTranslation();

	// Transform items to include translated labels if translationKey is provided
	const transformedItems = items.map((item) => ({
		href: item.href,
		label: item.translationKey
			? t(item.translationKey)
			: item.label || "",
	}));

	return (
		<Breadcrumb
			items={transformedItems}
			homeLink={homeLink}
			className={className}
		/>
	);
}
