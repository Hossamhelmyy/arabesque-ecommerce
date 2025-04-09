export type Category = {
	id: string;
	name: string;
	name_ar: string;
	slug: string;
	image: string | null;
	parent_id: string | null;
	products_count?: number;
};

export type CategoryListProps = {
	categories: Category[];
	isLoading?: boolean;
	onSearch?: (term: string) => void;
	searchTerm?: string;
};

export type CategoryContextType = {
	categories: Category[] | null;
	isLoading: boolean;
	error: Error | null;
};
