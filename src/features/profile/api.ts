import { supabase } from "@/integrations/supabase/client";
import type {
	Profile,
	Order,
	ProfileFormValues,
} from "./types";

export const fetchProfile = async (userId: string) => {
	const { data, error } = await supabase
		.from("profiles")
		.select("*")
		.eq("id", userId)
		.single();

	if (error) throw error;
	return data as Profile;
};

export const fetchOrders = async (userId: string) => {
	const { data, error } = await supabase
		.from("orders")
		.select("id, created_at, status, total")
		.eq("user_id", userId)
		.order("created_at", { ascending: false });

	if (error) throw error;
	return data as Order[];
};

export const updateProfile = async (
	userId: string,
	data: ProfileFormValues,
) => {
	const { error } = await supabase
		.from("profiles")
		.update({
			first_name: data.firstName,
			last_name: data.lastName,
			first_name_ar: data.firstName_ar,
			last_name_ar: data.lastName_ar,
			phone: data.phone,
		})
		.eq("id", userId);

	if (error) throw error;
};

export const updatePassword = async (
	newPassword: string,
) => {
	const { error } = await supabase.auth.updateUser({
		password: newPassword,
	});

	if (error) throw error;
};
