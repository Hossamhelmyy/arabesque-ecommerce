/**
 * Utility function to generate a URL-friendly slug from a string
 * Converts spaces to hyphens, removes special characters, and converts to lowercase
 */
export function generateSlug(str: string): string {
	return str
		.toLowerCase()
		.trim()
		.replace(/\s+/g, "-") // Replace spaces with hyphens
		.replace(/[^\w-]+/g, "") // Remove non-word chars (except hyphens)
		.replace(/--+/g, "-") // Replace multiple hyphens with single hyphen
		.replace(/^-+/, "") // Trim hyphens from start
		.replace(/-+$/, ""); // Trim hyphens from end
}
