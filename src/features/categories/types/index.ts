export type Category = {
	id: string;
	name: string;
	name_ar: string;
	slug: string;
	description?: string | null;
	description_ar?: string | null;
	image?: string | null;
};

export type CategoryContextType = {
	categories: Category[] | null;
	isLoading: boolean;
	error: Error | null;
};
