import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/context/AuthContext";
import {
	Logo,
	LanguageSelector,
	ThemeToggle,
	MobileNavigation,
	DesktopNavigation,
	UserMenu,
	CartIcon,
	FavoritesIcon,
} from "./header-components";

interface HeaderProps {
	isAdmin?: boolean;
}

const Header = ({ isAdmin = false }: HeaderProps) => {
	const [isSheetOpen, setIsSheetOpen] = useState(false);
	const isMobile = useIsMobile();
	const { user } = useAuth();
	const isUserAdmin = user?.role === "admin";

	return (
		<header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-16 items-center justify-between sm:px-6 px-2">
				<div className="flex items-center gap-4">
					{!isAdmin && (
						<MobileNavigation
							isAdmin={isAdmin}
							isOpen={isSheetOpen}
							setIsOpen={setIsSheetOpen}
						/>
					)}
					<Logo isAdmin={isAdmin} />
				</div>

				{!isMobile && (
					<DesktopNavigation
						isAdmin={isAdmin}
						isUserAdmin={isUserAdmin}
					/>
				)}

				<div className="flex items-center gap-2">
					<LanguageSelector />
					<ThemeToggle />

					{!isAdmin && (
						<>
							<FavoritesIcon />
							<CartIcon />
						</>
					)}

					<UserMenu isAdmin={isAdmin} />
				</div>
			</div>
		</header>
	);
};

export default Header;
