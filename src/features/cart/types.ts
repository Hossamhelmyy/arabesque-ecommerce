export interface CartItemDetail {
	id?: string;
	product_id: string;
	quantity: number;
	name: string;
	name_ar?: string;
	price: number;
	sale_price?: number;
	image: string;
	created_at?: string;
}
