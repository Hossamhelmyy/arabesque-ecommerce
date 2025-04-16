export type Profile = {
	id: string;
	first_name: string | null;
	last_name: string | null;
	first_name_ar: string | null;
	last_name_ar: string | null;
	phone: string | null;
	avatar_url: string | null;
	address: {
		street: string;
		city: string;
		state: string;
		zipCode: string;
		country: string;
		apartment?: string;
	} | null;
};

export type Order = {
	id: string;
	created_at: string;
	status: string;
	total: number;
};

// Profile form schema
export type ProfileFormValues = {
	firstName: string;
	lastName: string;
	firstName_ar?: string;
	lastName_ar?: string;
	phone?: string;
};

// Password form schema
export type PasswordFormValues = {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
};

export type { Address } from "./types/index";
