import * as React from "react";
import {
	ChevronRight,
	ChevronLeft,
	Home,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

interface BreadcrumbProps
	extends React.HTMLAttributes<HTMLElement> {
	items: {
		href: string;
		label: string;
		current?: boolean;
	}[];
	homeLink?: boolean;
	className?: string;
}

export function Breadcrumb({
	items,
	homeLink = true,
	className,
	...props
}: BreadcrumbProps) {
	const { t } = useTranslation();
	const { isRTL } = useLanguage();

	const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

	return (
		<nav
			aria-label="Breadcrumb"
			className={cn("mb-6", className)}
			{...props}>
			<ol className="flex items-center text-sm text-muted-foreground">
				{homeLink && (
					<li className="flex items-center">
						<Link
							to="/"
							className="hover:text-primary transition-colors inline-flex items-center"
							aria-label={t("common.home")}>
							<Home className="h-4 w-4" />
							<span className="sr-only sm:not-sr-only sm:ms-1">
								{t("common.home")}
							</span>
						</Link>
						<span className="mx-2 flex items-center">
							<ChevronIcon className="h-4 w-4" />
						</span>
					</li>
				)}

				{items.map((item, index) => {
					const isLast = index === items.length - 1;

					return (
						<li
							key={item.href}
							className="flex items-center">
							{isLast ? (
								<span
									className="text-foreground font-medium"
									aria-current="page">
									{item.label}
								</span>
							) : (
								<>
									<Link
										to={item.href}
										className="hover:text-primary transition-colors">
										{item.label}
									</Link>
									<span className="mx-2 flex items-center">
										<ChevronIcon className="h-4 w-4" />
									</span>
								</>
							)}
						</li>
					);
				})}
			</ol>
		</nav>
	);
}
