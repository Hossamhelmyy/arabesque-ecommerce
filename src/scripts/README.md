# Supabase Database Seeding Scripts

This directory contains scripts to help populate your Supabase database with sample data for the Arabesque eCommerce store. These scripts will create categories and products with multiple images to ensure a rich user experience.

## Prerequisites

Before running these scripts, make sure you have:

1. A Supabase project set up and running
2. The Supabase URL and anonymous key available in your `.env` file
3. Node.js installed on your machine
4. Required dependencies installed (`npm install @supabase/supabase-js dotenv`)

## Environment Setup

Create or update your `.env` file in the root directory with your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Running the Scripts

### 1. Seed Categories

First, populate your database with categories and subcategories:

```bash
node src/scripts/seed-categories.js
```

This script will:

- Create 6 main product categories (Furniture, Pottery, Textiles, Lighting, Rugs & Carpets, Home Decor)
- Create multiple subcategories for each main category
- Set up proper category relationships (parent/child)
- Add sample images for each category

### 2. Seed Products

After categories are created, populate products with multiple images:

```bash
node src/scripts/seed-products.js
```

This script will:

- Add 8-12 products to each category
- Assign multiple images to each product (1-3 additional images besides the main image)
- Generate realistic product details including:
  - Name (English and Arabic)
  - Description (English and Arabic placeholder)
  - Price information (with some items on sale)
  - Stock quantity
  - New/Sale status flags

## Image URLs

The scripts use placeholder image URLs from a hypothetical S3 bucket. You should:

1. Replace these URLs with your actual image URLs
2. OR upload sample images with the filenames specified in the scripts to your storage bucket

## Database Schema

These scripts assume your Supabase database has the following tables:

### `categories` table:

- `id` (auto-generated)
- `name` (string)
- `name_ar` (string)
- `slug` (string)
- `image` (string)
- `parent_id` (foreign key, nullable)

### `products` table:

- `id` (auto-generated)
- `name` (string)
- `name_ar` (string)
- `slug` (string)
- `description` (text, nullable)
- `description_ar` (text, nullable)
- `price` (number)
- `original_price` (number, nullable)
- `image` (string)
- `images` (array of strings, nullable)
- `stock_quantity` (number)
- `is_new` (boolean)
- `is_on_sale` (boolean)
- `category_id` (foreign key)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## Customization

You can modify these scripts to:

- Add more categories or subcategories
- Change product attributes
- Add or modify descriptions
- Adjust pricing strategies
- Change the number of products per category

## Troubleshooting

If you encounter errors:

1. Check that your Supabase credentials are correct
2. Ensure your database tables match the expected schema
3. Look for detailed error messages in the console output
4. Verify network connectivity to your Supabase instance

## Note on Images

For a production environment, you should:

1. Upload actual product images to your Supabase storage
2. Update the image URLs in the scripts to point to your actual images
3. Consider using a CDN for better performance

For testing purposes, you can use placeholder image services or upload sample images to your Supabase storage.
