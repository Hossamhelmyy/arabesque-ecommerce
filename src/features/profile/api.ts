import { supabase } from "@/integrations/supabase/client";
import type {
	Profile,
	Order,
	ProfileFormValues,
	PasswordFormValues,
	Address,
} from "./types";

export const fetchProfile = async (userId: string) => {
	const { data, error } = await supabase
		.from("profiles")
		.select("*")
		.eq("id", userId)
		.single();

	if (error) {
		console.error("Error fetching profile:", error);
		return null;
	}

	return data;
};

export const fetchOrders = async (userId: string) => {
	const { data, error } = await supabase
		.from("orders")
		.select("*")
		.eq("user_id", userId)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching orders:", error);
		return [];
	}

	return data;
};

export async function updateProfile(
	userId: string,
	profileData: ProfileFormValues,
) {
	const { error } = await supabase
		.from("profiles")
		.update({
			first_name: profileData.firstName,
			last_name: profileData.lastName,
			first_name_ar: profileData.firstName_ar,
			last_name_ar: profileData.lastName_ar,
			phone: profileData.phone,
			updated_at: new Date().toISOString(),
		})
		.eq("id", userId);

	if (error) {
		console.error("Error updating profile:", error);
		throw error;
	}

	return true;
}

export const updatePassword = async (
	newPassword: string,
) => {
	const { error } = await supabase.auth.updateUser({
		password: newPassword,
	});

	if (error) {
		console.error("Error updating password:", error);
		throw error;
	}

	return true;
};

// Address management functions
export async function fetchAddresses(userId: string) {
	const { data, error } = await supabase
		.from("addresses")
		.select("*")
		.eq("user_id", userId)
		.order("is_default", { ascending: false })
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching addresses:", error);
		return [];
	}

	return data;
}

export async function addAddress(
	userId: string,
	address: Address,
) {
	// If this is marked as default, unset any existing default addresses
	if (address.is_default) {
		await unsetDefaultAddresses(userId);
	}

	const { data, error } = await supabase
		.from("addresses")
		.insert({
			user_id: userId,
			full_name: address.full_name,
			street_address: address.street_address,
			city: address.city,
			state: address.state,
			postal_code: address.postal_code,
			country: address.country,
			phone_number: address.phone_number,
			is_default: address.is_default || false,
		})
		.select();

	if (error) {
		console.error("Error adding address:", error);
		throw error;
	}

	return data[0];
}

export async function updateAddress(
	addressId: string,
	address: Address,
) {
	// If this is marked as default, unset any existing default addresses
	if (address.is_default) {
		await unsetDefaultAddresses(address.user_id as string);
	}

	const { data, error } = await supabase
		.from("addresses")
		.update({
			full_name: address.full_name,
			street_address: address.street_address,
			city: address.city,
			state: address.state,
			postal_code: address.postal_code,
			country: address.country,
			phone_number: address.phone_number,
			is_default: address.is_default,
		})
		.eq("id", addressId)
		.select();

	if (error) {
		console.error("Error updating address:", error);
		throw error;
	}

	return data[0];
}

export async function deleteAddress(addressId: string) {
	const { error } = await supabase
		.from("addresses")
		.delete()
		.eq("id", addressId);

	if (error) {
		console.error("Error deleting address:", error);
		throw error;
	}

	return true;
}

export async function setDefaultAddress(
	userId: string,
	addressId: string,
) {
	// First, unset any existing default addresses
	await unsetDefaultAddresses(userId);

	// Then, set the new default address
	const { error } = await supabase
		.from("addresses")
		.update({ is_default: true })
		.eq("id", addressId);

	if (error) {
		console.error("Error setting default address:", error);
		throw error;
	}

	return true;
}

async function unsetDefaultAddresses(userId: string) {
	const { error } = await supabase
		.from("addresses")
		.update({ is_default: false })
		.eq("user_id", userId)
		.eq("is_default", true);

	if (error) {
		console.error(
			"Error unsetting default addresses:",
			error,
		);
		throw error;
	}

	return true;
}
