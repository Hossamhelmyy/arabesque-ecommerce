// This script sets up the necessary database schema in Supabase
// Run with: node src/scripts/setup-db-schemas.js

console.log("This script is a reference for the SQL commands to run in the Supabase SQL Editor.");
console.log("Copy and run these commands in your Supabase dashboard's SQL Editor.");
console.log("\n-------------------------------------\n");

const createCategoriesTable = `
-- Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image TEXT,
  parent_id UUID REFERENCES public.categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS Policies
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read categories
CREATE POLICY "Allow public read access to categories"
ON public.categories FOR SELECT USING (true);

-- Allow authenticated users to create categories (admin only in a real app)
CREATE POLICY "Allow authenticated users to create categories"
ON public.categories FOR INSERT TO authenticated USING (true);

-- Allow authenticated users to update categories (admin only in a real app)
CREATE POLICY "Allow authenticated users to update categories"
ON public.categories FOR UPDATE TO authenticated USING (true);

-- Add indexes
CREATE INDEX IF NOT EXISTS categories_parent_id_idx ON public.categories(parent_id);
CREATE INDEX IF NOT EXISTS categories_slug_idx ON public.categories(slug);
`;

const createProductsTable = `
-- Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  description_ar TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  image TEXT NOT NULL,
  images TEXT[],
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_on_sale BOOLEAN DEFAULT false,
  category_id UUID REFERENCES public.categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS Policies
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read products
CREATE POLICY "Allow public read access to products"
ON public.products FOR SELECT USING (true);

-- Allow authenticated users to create products (admin only in a real app)
CREATE POLICY "Allow authenticated users to create products"
ON public.products FOR INSERT TO authenticated USING (true);

-- Allow authenticated users to update products (admin only in a real app)
CREATE POLICY "Allow authenticated users to update products"
ON public.products FOR UPDATE TO authenticated USING (true);

-- Add indexes
CREATE INDEX IF NOT EXISTS products_category_id_idx ON public.products(category_id);
CREATE INDEX IF NOT EXISTS products_slug_idx ON public.products(slug);
CREATE INDEX IF NOT EXISTS products_price_idx ON public.products(price);
CREATE INDEX IF NOT EXISTS products_is_new_idx ON public.products(is_new);
CREATE INDEX IF NOT EXISTS products_is_on_sale_idx ON public.products(is_on_sale);
`;

const createWishlistTable = `
-- Create Wishlist Table
CREATE TABLE IF NOT EXISTS public.wishlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Add RLS Policies
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own wishlist
CREATE POLICY "Allow users to view their own wishlist"
ON public.wishlist FOR SELECT USING (auth.uid() = user_id);

-- Allow users to add to their own wishlist
CREATE POLICY "Allow users to add to their own wishlist"
ON public.wishlist FOR INSERT TO authenticated USING (auth.uid() = user_id);

-- Allow users to delete from their own wishlist
CREATE POLICY "Allow users to delete from their own wishlist"
ON public.wishlist FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Add indexes
CREATE INDEX IF NOT EXISTS wishlist_user_id_idx ON public.wishlist(user_id);
CREATE INDEX IF NOT EXISTS wishlist_product_id_idx ON public.wishlist(product_id);
`;

// Print the SQL statements
console.log("/* Step 1: Create Categories Table */");
console.log(createCategoriesTable);
console.log("\n/* Step 2: Create Products Table */");
console.log(createProductsTable);
console.log("\n/* Step 3: Create Wishlist Table */");
console.log(createWishlistTable);

console.log("\n-------------------------------------\n");
console.log("Instructions:");
console.log("1. Go to your Supabase project");
console.log("2. Navigate to the SQL Editor");
console.log("3. Copy each section and run it separately");
console.log("4. Verify the tables are created in the Table Editor");
console.log("\nNote: Make sure the RLS policies align with your application's security requirements.");