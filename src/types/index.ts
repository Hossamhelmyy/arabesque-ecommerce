export interface Product {
	id: string;
	name: string;
	name_ar: string;
	description?: string;
	description_ar?: string;
	price: number;
	original_price?: number | null;
	image: string;
	images?: string[];
	slug: string;
	category_id?: string | null;
	is_new?: boolean | null;
	is_on_sale?: boolean | null;
	is_featured?: boolean | null;
	created_at?: string;
	stock_quantity?: number;
}
