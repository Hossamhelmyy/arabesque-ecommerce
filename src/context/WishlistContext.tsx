import React, { createContext, useContext } from "react";
import { type WishlistContextType } from "@/features/wishlist/types";
import { useWishlist } from "@/features/wishlist/hooks";

const WishlistContext = createContext<
	WishlistContextType | undefined
>(undefined);

export const WishlistProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const wishlistState = useWishlist();

	return (
		<WishlistContext.Provider value={wishlistState}>
			{children}
		</WishlistContext.Provider>
	);
};

export const useWishlistContext = () => {
	const context = useContext(WishlistContext);
	if (context === undefined) {
		throw new Error(
			"useWishlistContext must be used within a WishlistProvider",
		);
	}
	return context;
};
