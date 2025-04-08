import {
	supabase,
	getStorageUrl,
} from "@/integrations/supabase/client";
import {
	MAX_FILE_SIZE,
	ALLOWED_FILE_TYPES,
} from "@/utils/env";
import { v4 as uuidv4 } from "uuid";

/**
 * Error type for upload validation errors
 */
export class UploadValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "UploadValidationError";
	}
}

/**
 * Validates a file before upload
 * @param file - The file to validate
 * @param maxSize - Maximum file size in bytes
 * @param allowedTypes - Array of allowed MIME types
 * @returns {boolean} Whether the file is valid
 * @throws {UploadValidationError} If validation fails
 */
export function validateFile(
	file: File,
	maxSize = MAX_FILE_SIZE,
	allowedTypes = ALLOWED_FILE_TYPES,
): boolean {
	// Check file size
	if (file.size > maxSize) {
		throw new UploadValidationError(
			`File is too large. Maximum size is ${
				maxSize / (1024 * 1024)
			}MB.`,
		);
	}

	// Check file type
	if (!allowedTypes.includes(file.type)) {
		throw new UploadValidationError(
			`File type ${
				file.type
			} is not allowed. Allowed types: ${allowedTypes.join(
				", ",
			)}`,
		);
	}

	return true;
}

/**
 * Uploads a file to Supabase storage
 * @param file - The file to upload
 * @param bucket - The storage bucket to upload to
 * @param folder - Optional folder path within the bucket
 * @returns The public URL of the uploaded file
 */
export async function uploadFile(
	file: File,
	bucket = "uploads",
	folder?: string,
): Promise<string> {
	try {
		// Validate the file
		validateFile(file);

		// Generate a unique filename to prevent collisions
		const fileExt = file.name.split(".").pop();
		const fileName = `${uuidv4()}.${fileExt}`;

		// Construct the file path, including optional folder
		const filePath = folder
			? `${folder}/${fileName}`
			: fileName;

		// Upload the file to Supabase
		const { error: uploadError } = await supabase.storage
			.from(bucket)
			.upload(filePath, file, {
				cacheControl: "3600",
				upsert: false,
			});

		if (uploadError) {
			console.error("Error uploading file:", uploadError);
			throw new Error(
				`Error uploading file: ${uploadError.message}`,
			);
		}

		// Return the public URL
		return getStorageUrl(bucket, filePath);
	} catch (error) {
		console.error("File upload error:", error);
		if (error instanceof UploadValidationError) {
			throw error;
		}
		throw new Error(
			"Failed to upload file. Please try again.",
		);
	}
}

/**
 * Uploads multiple files to Supabase storage
 * @param files - The files to upload
 * @param bucket - The bucket to upload to (optional, defaults to "uploads")
 * @param folder - The folder within the bucket (optional)
 * @returns {Promise<string[]>} Array of public URLs of the uploaded files
 */
export async function uploadMultipleFiles(
	files: File[],
	bucket = "uploads",
	folder?: string,
): Promise<string[]> {
	try {
		const uploadPromises = files.map((file) =>
			uploadFile(file, bucket, folder),
		);
		return await Promise.all(uploadPromises);
	} catch (error) {
		console.error("Multiple files upload error:", error);
		throw error;
	}
}

/**
 * Deletes a file from Supabase storage
 * @param fileUrl - The URL of the file to delete
 * @returns Success status
 */
export async function deleteFile(
	fileUrl: string,
): Promise<boolean> {
	try {
		// Extract the bucket and path from the URL
		const urlParts = fileUrl.split(
			"/storage/v1/object/public/",
		);
		if (urlParts.length !== 2) {
			throw new Error("Invalid file URL format");
		}

		const [bucket, path] = urlParts[1].split("/", 1);
		const filePath = urlParts[1].slice(bucket.length + 1);

		// Delete the file
		const { error } = await supabase.storage
			.from(bucket)
			.remove([filePath]);

		if (error) {
			console.error("Error deleting file:", error);
			return false;
		}

		return true;
	} catch (error) {
		console.error("Error in deleteFile:", error);
		return false;
	}
}

export default {
	uploadFile,
	deleteFile,
	validateFile,
};
