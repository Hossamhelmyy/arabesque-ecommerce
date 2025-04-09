// Export components
export * from "./components";

// Export all types from types/index.ts
export type {
	CartItemDetail,
	CartSummary,
	CartState,
	CartUpdateAction,
	CartContextType,
} from "./types/index";

// Export CartSummaryData as an alias of CartSummary
export type { CartSummary as CartSummaryData } from "./types/index";
