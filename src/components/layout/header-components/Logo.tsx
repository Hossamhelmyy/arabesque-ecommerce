import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface LogoProps {
	isAdmin?: boolean;
}

export const Logo = ({ isAdmin = false }: LogoProps) => {
	const { t } = useTranslation();

	return (
		<Link
			to={isAdmin ? "/admin/dashboard" : "/"}
			className="flex items-center space-x-2 rtl:space-x-reverse">
			<span className="md:text-2xl text-lg font-heading font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
				{isAdmin ? t("admin.title") : t("common.appName")}
			</span>
		</Link>
	);
};

export default Logo;
