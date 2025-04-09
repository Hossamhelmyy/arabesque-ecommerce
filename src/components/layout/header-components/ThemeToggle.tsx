import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import Cookies from "js-cookie";

export const ThemeToggle = () => {
	const { t } = useTranslation();
	const [isDarkMode, setIsDarkMode] = useState(() => {
		const theme = Cookies.get("theme");
		return theme === "dark";
	});

	useEffect(() => {
		const theme = Cookies.get("theme") || "light";
		setIsDarkMode(theme === "dark");
		document.documentElement.classList.toggle(
			"dark",
			theme === "dark",
		);
	}, []);

	const toggleTheme = () => {
		const newTheme = !isDarkMode ? "dark" : "light";
		setIsDarkMode(!isDarkMode);
		document.documentElement.classList.toggle("dark");
		Cookies.set("theme", newTheme, { expires: 365 });
	};

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={toggleTheme}
			className="hidden sm:flex">
			{isDarkMode ? (
				<Sun className="h-5 w-5" />
			) : (
				<Moon className="h-5 w-5" />
			)}
			<span className="sr-only">
				{t("common.toggleTheme")}
			</span>
		</Button>
	);
};

export default ThemeToggle;
