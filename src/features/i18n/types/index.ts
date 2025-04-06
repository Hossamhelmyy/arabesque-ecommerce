export type LanguageContextType = {
	isRTL: boolean;
	toggleLanguage: () => void;
	changeLanguage: (language: string) => void;
	currentLanguage: string;
};
