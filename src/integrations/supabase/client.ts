// This file is automatically generated. Do not edit it directly.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env
	.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error("Missing Supabase environment variables");
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
	supabaseUrl,
	supabaseAnonKey,
);

/**
 * Get the storage URL for a bucket and file path
 * @param bucket - The storage bucket name
 * @param filePath - The path to the file within the bucket
 * @returns The full URL to the file
 */
export const getStorageUrl = (
	bucket: string,
	filePath: string,
): string => {
	return `${supabaseUrl}/storage/v1/object/public/${bucket}/${filePath}`;
};

export default supabase;
