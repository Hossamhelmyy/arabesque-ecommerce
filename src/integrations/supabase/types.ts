export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export interface Database {
	public: {
		Tables: {
			banners: {
				Row: {
					id: string;
					title: string;
					subtitle: string | null;
					image: string;
					link: string | null;
					active: boolean;
					position: number;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					title: string;
					subtitle?: string | null;
					image: string;
					link?: string | null;
					active?: boolean;
					position?: number;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					title?: string;
					subtitle?: string | null;
					image?: string;
					link?: string | null;
					active?: boolean;
					position?: number;
					created_at?: string;
					updated_at?: string;
				};
			};
			promotions: {
				Row: {
					id: string;
					title: string;
					description: string | null;
					code: string;
					image: string | null;
					discount: string | null;
					start_date: string;
					end_date: string;
					active: boolean;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					title: string;
					description?: string | null;
					code: string;
					image?: string | null;
					discount?: string | null;
					start_date: string;
					end_date: string;
					active?: boolean;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					title?: string;
					description?: string | null;
					code?: string;
					image?: string | null;
					discount?: string | null;
					start_date?: string;
					end_date?: string;
					active?: boolean;
					created_at?: string;
					updated_at?: string;
				};
			};
			cart: {
				Row: {
					created_at: string | null;
					id: string;
					product_id: string;
					quantity: number;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					created_at?: string | null;
					id?: string;
					product_id: string;
					quantity?: number;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					created_at?: string | null;
					id?: string;
					product_id?: string;
					quantity?: number;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "cart_product_id_fkey";
						columns: ["product_id"];
						isOneToOne: false;
						referencedRelation: "products";
						referencedColumns: ["id"];
					},
				];
			};
			categories: {
				Row: {
					created_at: string | null;
					id: string;
					image: string | null;
					name: string;
					name_ar: string;
					parent_id: string | null;
					slug: string;
					updated_at: string | null;
				};
				Insert: {
					created_at?: string | null;
					id?: string;
					image?: string | null;
					name: string;
					name_ar: string;
					parent_id?: string | null;
					slug: string;
					updated_at?: string | null;
				};
				Update: {
					created_at?: string | null;
					id?: string;
					image?: string | null;
					name?: string;
					name_ar?: string;
					parent_id?: string | null;
					slug?: string;
					updated_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "categories_parent_id_fkey";
						columns: ["parent_id"];
						isOneToOne: false;
						referencedRelation: "categories";
						referencedColumns: ["id"];
					},
				];
			};
			order_items: {
				Row: {
					created_at: string | null;
					id: string;
					order_id: string;
					price: number;
					product_id: string;
					quantity: number;
				};
				Insert: {
					created_at?: string | null;
					id?: string;
					order_id: string;
					price: number;
					product_id: string;
					quantity: number;
				};
				Update: {
					created_at?: string | null;
					id?: string;
					order_id?: string;
					price?: number;
					product_id?: string;
					quantity?: number;
				};
				Relationships: [
					{
						foreignKeyName: "order_items_order_id_fkey";
						columns: ["order_id"];
						isOneToOne: false;
						referencedRelation: "orders";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "order_items_product_id_fkey";
						columns: ["product_id"];
						isOneToOne: false;
						referencedRelation: "products";
						referencedColumns: ["id"];
					},
				];
			};
			orders: {
				Row: {
					created_at: string | null;
					id: string;
					payment_method: string;
					shipping_address: Json;
					status: string;
					total: number;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					created_at?: string | null;
					id?: string;
					payment_method: string;
					shipping_address: Json;
					status?: string;
					total: number;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					created_at?: string | null;
					id?: string;
					payment_method?: string;
					shipping_address?: Json;
					status?: string;
					total?: number;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [];
			};
			products: {
				Row: {
					category_id: string | null;
					created_at: string | null;
					description: string | null;
					description_ar: string | null;
					id: string;
					image: string;
					images: Json | null;
					is_featured: boolean | null;
					is_new: boolean | null;
					is_on_sale: boolean | null;
					name: string;
					name_ar: string;
					original_price: number | null;
					price: number;
					slug: string;
					stock_quantity: number;
					updated_at: string | null;
				};
				Insert: {
					category_id?: string | null;
					created_at?: string | null;
					description?: string | null;
					description_ar?: string | null;
					id?: string;
					image: string;
					images?: Json | null;
					is_featured?: boolean | null;
					is_new?: boolean | null;
					is_on_sale?: boolean | null;
					name: string;
					name_ar: string;
					original_price?: number | null;
					price: number;
					slug: string;
					stock_quantity?: number;
					updated_at?: string | null;
				};
				Update: {
					category_id?: string | null;
					created_at?: string | null;
					description?: string | null;
					description_ar?: string | null;
					id?: string;
					image?: string;
					images?: Json | null;
					is_featured?: boolean | null;
					is_new?: boolean | null;
					is_on_sale?: boolean | null;
					name?: string;
					name_ar?: string;
					original_price?: number | null;
					price?: number;
					slug?: string;
					stock_quantity?: number;
					updated_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "fk_product_category";
						columns: ["category_id"];
						isOneToOne: false;
						referencedRelation: "categories";
						referencedColumns: ["id"];
					},
				];
			};
			profiles: {
				Row: {
					address: Json | null;
					avatar_url: string | null;
					created_at: string | null;
					first_name: string | null;
					first_name_ar: string | null;
					id: string;
					last_name: string | null;
					last_name_ar: string | null;
					phone: string | null;
					updated_at: string | null;
				};
				Insert: {
					address?: Json | null;
					avatar_url?: string | null;
					created_at?: string | null;
					first_name?: string | null;
					first_name_ar?: string | null;
					id: string;
					last_name?: string | null;
					last_name_ar?: string | null;
					phone?: string | null;
					updated_at?: string | null;
				};
				Update: {
					address?: Json | null;
					avatar_url?: string | null;
					created_at?: string | null;
					first_name?: string | null;
					first_name_ar?: string | null;
					id?: string;
					last_name?: string | null;
					last_name_ar?: string | null;
					phone?: string | null;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			reviews: {
				Row: {
					comment: string | null;
					created_at: string | null;
					id: string;
					product_id: string;
					rating: number;
					user_id: string;
				};
				Insert: {
					comment?: string | null;
					created_at?: string | null;
					id?: string;
					product_id: string;
					rating: number;
					user_id: string;
				};
				Update: {
					comment?: string | null;
					created_at?: string | null;
					id?: string;
					product_id?: string;
					rating?: number;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "reviews_product_id_fkey";
						columns: ["product_id"];
						isOneToOne: false;
						referencedRelation: "products";
						referencedColumns: ["id"];
					},
				];
			};
			wish_list: {
				Row: {
					created_at: string | null;
					id: string;
					product_id: string;
					user_id: string;
				};
				Insert: {
					created_at?: string | null;
					id?: string;
					product_id: string;
					user_id: string;
				};
				Update: {
					created_at?: string | null;
					id?: string;
					product_id?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "wish_list_product_id_fkey";
						columns: ["product_id"];
						isOneToOne: false;
						referencedRelation: "products";
						referencedColumns: ["id"];
					},
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
}

type PublicSchema = Database[Extract<
	keyof Database,
	"public"
>];

export type Tables<
	PublicTableNameOrOptions extends
		| keyof (PublicSchema["Tables"] & PublicSchema["Views"])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
				Database[PublicTableNameOrOptions["schema"]]["Views"])
		: never = never,
> = PublicTableNameOrOptions extends {
	schema: keyof Database;
}
	? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
			Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
	  }
		? R
		: never
	: PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
			PublicSchema["Views"])
	? (PublicSchema["Tables"] &
			PublicSchema["Views"])[PublicTableNameOrOptions] extends {
			Row: infer R;
	  }
		? R
		: never
	: never;

export type TablesInsert<
	PublicTableNameOrOptions extends
		| keyof PublicSchema["Tables"]
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = PublicTableNameOrOptions extends {
	schema: keyof Database;
}
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
	  }
		? I
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
	? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
			Insert: infer I;
	  }
		? I
		: never
	: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends
		| keyof PublicSchema["Tables"]
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = PublicTableNameOrOptions extends {
	schema: keyof Database;
}
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
	  }
		? U
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
	? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
			Update: infer U;
	  }
		? U
		: never
	: never;

export type Enums<
	PublicEnumNameOrOptions extends
		| keyof PublicSchema["Enums"]
		| { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
		: never = never,
> = PublicEnumNameOrOptions extends {
	schema: keyof Database;
}
	? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
	? PublicSchema["Enums"][PublicEnumNameOrOptions]
	: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof PublicSchema["CompositeTypes"]
		| { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never,
> = PublicCompositeTypeNameOrOptions extends {
	schema: keyof Database;
}
	? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
	? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
	: never;
