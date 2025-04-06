import React, {
	createContext,
	useContext,
	useState,
	useEffect,
} from "react";
import { useTranslation } from "react-i18next";
import type { LanguageContextType } from "@/features/i18n/types";

const LanguageContext = createContext<
	LanguageContextType | undefined
>(undefined);

export const LanguageProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const { i18n } = useTranslation();
	const [isRTL, setIsRTL] = useState(
		i18n.language === "ar",
	);

	useEffect(() => {
		setIsRTL(i18n.language === "ar");
		document.documentElement.dir = isRTL ? "rtl" : "ltr";
		document.documentElement.lang = i18n.language;
	}, [i18n.language, isRTL]);

	// Toggle between English and Arabic
	const toggleLanguage = () => {
		const newLang = i18n.language === "en" ? "ar" : "en";
		i18n.changeLanguage(newLang);
	};

	// Change to a specific language
	const changeLanguage = (language: string) => {
		i18n.changeLanguage(language);
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
