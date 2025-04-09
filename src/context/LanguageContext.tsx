import React, {
	createContext,
	useContext,
	useState,
	useEffect,
} from "react";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import type { LanguageContextType } from "@/features/i18n/types";

const LanguageContext = createContext<
	LanguageContextType | undefined
>(undefined);

export const LanguageProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const { i18n } = useTranslation();
	const [isRTL, setIsRTL] = useState(() => {
		const savedLang = Cookies.get("language") || "en";
		return savedLang === "ar";
	});

	useEffect(() => {
		// Initialize language from cookie on mount
		const savedLang = Cookies.get("language");
		if (savedLang && savedLang !== i18n.language) {
			i18n.changeLanguage(savedLang);
		}
	}, [i18n]);

	useEffect(() => {
		setIsRTL(i18n.language === "ar");
		document.documentElement.dir = isRTL ? "rtl" : "ltr";
		document.documentElement.lang = i18n.language;
	}, [i18n.language, isRTL]);

	// Toggle between English and Arabic
	const toggleLanguage = () => {
		const newLang = i18n.language === "en" ? "ar" : "en";
		i18n.changeLanguage(newLang);
		Cookies.set("language", newLang, { expires: 365 });
	};

	// Change to a specific language
	const changeLanguage = (language: string) => {
		i18n.changeLanguage(language);
		Cookies.set("language", language, { expires: 365 });
	};

	return (
		<LanguageContext.Provider
			value={{
				isRTL,
				toggleLanguage,
				changeLanguage,
				currentLanguage: i18n.language,
			}}>
			{children}
		</LanguageContext.Provider>
	);
};
export const useLanguage = () => {
	const context = useContext(LanguageContext);
	if (context === undefined) {
		throw new Error(
			"useLanguage must be used within a LanguageProvider",
		);
	}
	return context;
};
