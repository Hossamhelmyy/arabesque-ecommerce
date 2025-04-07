import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

const BUCKET_NAME = "arabesque-ecommerce";

type UploadTarget = "products" | "categories" | "profiles";

/**
 * Upload a file to Supabase Storage
 *
 * @param file The file to upload
 * @param targetFolder The folder to upload to (e.g., 'products', 'categories')
 * @returns The URL of the uploaded file
 */
export async function uploadFile(
	file: File,
	targetFolder: UploadTarget,
): Promise<string> {
	try {
		// Generate a unique filename to prevent collisions
		const fileExt = file.name.split(".").pop();
		const fileName = `${uuidv4()}.${fileExt}`;
		const filePath = `${targetFolder}/${fileName}`;

		// Set the correct content type
		const contentType =
			file.type ||
			getContentTypeFromExtension(fileExt || "");

		// Upload the file
		const { data, error } = await supabase.storage
			.from(BUCKET_NAME)
			.upload(filePath, file, {
				contentType,
				upsert: true,
			});

		if (error) {
			throw error;
		}

		// Get the public URL
		const { data: urlData } = supabase.storage
			.from(BUCKET_NAME)
			.getPublicUrl(filePath);

		return urlData.publicUrl;
	} catch (error) {
		console.error("Error uploading file:", error);
		throw error;
	}
}

/**
 * Upload multiple files to Supabase Storage
 *
 * @param files An array of files to upload
 * @param targetFolder The folder to upload to
 * @returns An array of URLs of the uploaded files
 */
export async function uploadMultipleFiles(
	files: File[],
	targetFolder: UploadTarget,
): Promise<string[]> {
	try {
		// Upload each file and collect promises
		const uploadPromises = files.map((file) =>
			uploadFile(file, targetFolder),
		);

		// Wait for all uploads to complete
		return await Promise.all(uploadPromises);
	} catch (error) {
		console.error("Error uploading multiple files:", error);
		throw error;
	}
}

/**
 * Gets the content type based on the file extension
 */
function getContentTypeFromExtension(
	extension: string,
): string {
	const types: Record<string, string> = {
		jpg: "image/jpeg",
		jpeg: "image/jpeg",
		png: "image/png",
		gif: "image/gif",
		webp: "image/webp",
		svg: "image/svg+xml",
		pdf: "application/pdf",
	};

	return (
		types[extension.toLowerCase()] ||
		"application/octet-stream"
	);
}

/**
 * Delete a file from Supabase Storage
 *
 * @param url The public URL of the file to delete
 * @returns True if the file was deleted successfully
 */
export async function deleteFile(
	url: string,
): Promise<boolean> {
	try {
		// Extract the path from the URL
		const filePathMatch = url.match(
			new RegExp(`${BUCKET_NAME}/(.*)`),
		);

		if (!filePathMatch || filePathMatch.length < 2) {
			throw new Error("Invalid file URL");
		}

		const filePath = filePathMatch[1];

		const { error } = await supabase.storage
			.from(BUCKET_NAME)
			.remove([filePath]);

		if (error) {
			throw error;
		}

		return true;
	} catch (error) {
		console.error("Error deleting file:", error);
		return false;
	}
}
