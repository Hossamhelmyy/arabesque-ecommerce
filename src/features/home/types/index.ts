export type Banner = {
	id: string;
	title: string;
	title_ar?: string;
	subtitle?: string;
	subtitle_ar?: string;
	image_url: string;
	link?: string;
	position: "hero" | "secondary" | "promotional";
	is_active: boolean;
};

export type Testimonial = {
	id: string;
	customer_name: string;
	avatar_url?: string;
	content: string;
	content_ar?: string;
	rating: number;
	is_featured: boolean;
};

export type Promotion = {
	id: string;
	title: string;
	title_ar?: string;
	description?: string;
	description_ar?: string;
	image_url?: string;
	start_date: string;
	end_date: string;
	discount_percentage?: number;
	coupon_code?: string;
	is_active: boolean;
};
