import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const LanguageSelector = () => {
	const { t } = useTranslation();
	const { currentLanguage, changeLanguage } = useLanguage();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="hidden sm:flex">
					<Globe className="h-5 w-5" />
					<span className="sr-only">
						{t("common.language")}
					</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem
					onClick={() => changeLanguage("en")}>
					<span
						className={
							currentLanguage === "en" ? "font-bold" : ""
						}>
						English
					</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => changeLanguage("ar")}>
					<span
						className={
							currentLanguage === "ar" ? "font-bold" : ""
						}>
						العربية
					</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default LanguageSelector;
