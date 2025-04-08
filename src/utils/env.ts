/**
 * Environment Variables Utility
 *
 * This utility provides typesafe access to environment variables,
 * with fallbacks for development.
 */

// Supabase Configuration
export const SUPABASE_URL =
	import.meta.env.VITE_SUPABASE_URL || "";
export const SUPABASE_ANON_KEY =
	import.meta.env.VITE_SUPABASE_ANON_KEY || "";
export const SUPABASE_STORAGE_URL =
	import.meta.env.VITE_SUPABASE_STORAGE_URL || "";

// App Settings
export const APP_NAME =
	import.meta.env.VITE_APP_NAME ||
	"Arabesque E-commerce Oasis";
export const DEFAULT_LOCALE =
	import.meta.env.VITE_DEFAULT_LOCALE || "en";
export const AVAILABLE_LOCALES = (
	import.meta.env.VITE_AVAILABLE_LOCALES || "en,ar"
).split(",");

// Payment Gateway
export const STRIPE_PUBLIC_KEY =
	import.meta.env.VITE_STRIPE_PUBLIC_KEY || "";

// Analytics
export const GOOGLE_ANALYTICS_ID =
	import.meta.env.VITE_GOOGLE_ANALYTICS_ID || "";

// API Endpoints
export const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || "";

// Admin Configuration
export const ADMIN_EMAIL =
	import.meta.env.VITE_ADMIN_EMAIL ||
	"admin@arabesque-oasis.com";

// File Upload Limits
export const MAX_FILE_SIZE = Number(
	import.meta.env.VITE_MAX_FILE_SIZE || 5242880,
);
export const ALLOWED_FILE_TYPES = (
	import.meta.env.VITE_ALLOWED_FILE_TYPES ||
	"image/jpeg,image/png,image/webp,image/gif"
).split(",");

// Currency Settings
export const DEFAULT_CURRENCY =
	import.meta.env.VITE_DEFAULT_CURRENCY || "USD";
export const CURRENCY_DISPLAY =
	import.meta.env.VITE_CURRENCY_DISPLAY || "symbol";

/**
 * Checks if all required environment variables are set
 * @returns Object with validation status and any missing variables
 */
export const validateEnv = () => {
	const required = [
		"VITE_SUPABASE_URL",
		"VITE_SUPABASE_ANON_KEY",
	];

	const missing = required.filter(
		(key) => !import.meta.env[key],
	);

	return {
		valid: missing.length === 0,
		missing,
	};
};

// Helper for formatting currency based on environment settings
export const formatCurrency = (amount: number): string => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: DEFAULT_CURRENCY,
		currencyDisplay: CURRENCY_DISPLAY as
			| "symbol"
			| "code"
			| "name",
	}).format(amount);
};

export default {
	SUPABASE_URL,
	SUPABASE_ANON_KEY,
	SUPABASE_STORAGE_URL,
	APP_NAME,
	DEFAULT_LOCALE,
	AVAILABLE_LOCALES,
	STRIPE_PUBLIC_KEY,
	GOOGLE_ANALYTICS_ID,
	API_BASE_URL,
	ADMIN_EMAIL,
	MAX_FILE_SIZE,
	ALLOWED_FILE_TYPES,
	DEFAULT_CURRENCY,
	CURRENCY_DISPLAY,
	validateEnv,
	formatCurrency,
};
