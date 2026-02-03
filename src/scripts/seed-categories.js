// This script populates the Supabase database with sample categories
// Run with: node src/scripts/seed-categories.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Sample category image URLs
const imageBaseUrl = `${process.env.VITE_SUPABASE_URL}/storage/v1/object/public/arabesque-ecommerce/categories/`;

// Categories to create
const categories = [
    {
        name: 'Furniture',
        name_ar: 'أثاث',
        slug: 'furniture',
        image: `${imageBaseUrl}furniture.jpg`,
        parent_id: null
    },
    {
        name: 'Pottery',
        name_ar: 'فخار',
        slug: 'pottery',
        image: `${imageBaseUrl}pottery.jpg`,
        parent_id: null
    },
    {
        name: 'Textiles',
        name_ar: 'منسوجات',
        slug: 'textiles',
        image: `${imageBaseUrl}textiles.jpg`,
        parent_id: null
    },
    {
        name: 'Lighting',
        name_ar: 'إضاءة',
        slug: 'lighting',
        image: `${imageBaseUrl}lighting.jpg`,
        parent_id: null
    },
    {
        name: 'Rugs & Carpets',
        name_ar: 'سجاد',
        slug: 'rugs-carpets',
        image: `${imageBaseUrl}rugs.jpg`,
        parent_id: null
    },
    {
        name: 'Home Decor',
        name_ar: 'ديكور منزلي',
        slug: 'home-decor',
        image: `${imageBaseUrl}decor.jpg`,
        parent_id: null
    }
];

// Subcategories to create (will link to parent categories after creation)
const subcategories = [
    // Furniture subcategories
    {
        name: 'Tables',
        name_ar: 'طاولات',
        slug: 'tables',
        image: `${imageBaseUrl}tables.jpg`,
        parent_name: 'Furniture'
    },
    {
        name: 'Chairs',
        name_ar: 'كراسي',
        slug: 'chairs',
        image: `${imageBaseUrl}chairs.jpg`,
        parent_name: 'Furniture'
    },
    {
        name: 'Cabinets',
        name_ar: 'خزائن',
        slug: 'cabinets',
        image: `${imageBaseUrl}cabinets.jpg`,
        parent_name: 'Furniture'
    },
    {
        name: 'Sofas',
        name_ar: 'أرائك',
        slug: 'sofas',
        image: `${imageBaseUrl}sofas.jpg`,
        parent_name: 'Furniture'
    },

    // Pottery subcategories
    {
        name: 'Vases',
        name_ar: 'مزهريات',
        slug: 'vases',
        image: `${imageBaseUrl}vases.jpg`,
        parent_name: 'Pottery'
    },
    {
        name: 'Bowls',
        name_ar: 'أوعية',
        slug: 'bowls',
        image: `${imageBaseUrl}bowls.jpg`,
        parent_name: 'Pottery'
    },
    {
        name: 'Decorative Plates',
        name_ar: 'أطباق زخرفية',
        slug: 'decorative-plates',
        image: `${imageBaseUrl}plates.jpg`,
        parent_name: 'Pottery'
    },

    // Textiles subcategories
    {
        name: 'Cushions',
        name_ar: 'وسائد',
        slug: 'cushions',
        image: `${imageBaseUrl}cushions.jpg`,
        parent_name: 'Textiles'
    },
    {
        name: 'Throws',
        name_ar: 'أغطية',
        slug: 'throws',
        image: `${imageBaseUrl}throws.jpg`,
        parent_name: 'Textiles'
    },
    {
        name: 'Tapestries',
        name_ar: 'معلقات نسيجية',
        slug: 'tapestries',
        image: `${imageBaseUrl}tapestries.jpg`,
        parent_name: 'Textiles'
    },

    // Lighting subcategories
    {
        name: 'Pendant Lights',
        name_ar: 'مصابيح معلقة',
        slug: 'pendant-lights',
        image: `${imageBaseUrl}pendant-lights.jpg`,
        parent_name: 'Lighting'
    },
    {
        name: 'Table Lamps',
        name_ar: 'مصابيح طاولة',
        slug: 'table-lamps',
        image: `${imageBaseUrl}table-lamps.jpg`,
        parent_name: 'Lighting'
    },
    {
        name: 'Floor Lamps',
        name_ar: 'مصابيح أرضية',
        slug: 'floor-lamps',
        image: `${imageBaseUrl}floor-lamps.jpg`,
        parent_name: 'Lighting'
    },
    {
        name: 'Lanterns',
        name_ar: 'فوانيس',
        slug: 'lanterns',
        image: `${imageBaseUrl}lanterns.jpg`,
        parent_name: 'Lighting'
    },

    // Rugs & Carpets subcategories
    {
        name: 'Area Rugs',
        name_ar: 'سجاد المساحات',
        slug: 'area-rugs',
        image: `${imageBaseUrl}area-rugs.jpg`,
        parent_name: 'Rugs & Carpets'
    },
    {
        name: 'Runners',
        name_ar: 'سجاد الممرات',
        slug: 'rug-runners',
        image: `${imageBaseUrl}runners.jpg`,
        parent_name: 'Rugs & Carpets'
    },
    {
        name: 'Kilims',
        name_ar: 'كليم',
        slug: 'kilims',
        image: `${imageBaseUrl}kilims.jpg`,
        parent_name: 'Rugs & Carpets'
    },

    // Home Decor subcategories
    {
        name: 'Wall Art',
        name_ar: 'فن الجدار',
        slug: 'wall-art',
        image: `${imageBaseUrl}wall-art.jpg`,
        parent_name: 'Home Decor'
    },
    {
        name: 'Mirrors',
        name_ar: 'مرايا',
        slug: 'mirrors',
        image: `${imageBaseUrl}mirrors.jpg`,
        parent_name: 'Home Decor'
    },
    {
        name: 'Candle Holders',
        name_ar: 'حاملات شموع',
        slug: 'candle-holders',
        image: `${imageBaseUrl}candle-holders.jpg`,
        parent_name: 'Home Decor'
    },
    {
        name: 'Decorative Boxes',
        name_ar: 'صناديق زخرفية',
        slug: 'decorative-boxes',
        image: `${imageBaseUrl}decorative-boxes.jpg`,
        parent_name: 'Home Decor'
    }
];

// Function to create categories and subcategories
async function seedCategories() {
    try {
        console.log('Starting category creation...');

        // First, clear existing categories if needed (uncomment if you want to clear existing data)

        console.log('Clearing existing categories...');
        const { error: clearError } = await supabase
            .from('categories')
            .delete()
            .not('id', 'is', null); // Delete all rows

        if (clearError) {
            console.error('Error clearing categories:', clearError);
        }


        // Create main categories
        console.log('Creating main categories...');

        const categoryMap = {};

        for (const category of categories) {
            const { data, error } = await supabase
                .from('categories')
                .insert([category])
                .select();

            if (error) {
                console.error(`Error creating category ${category.name}:`, error);
            } else if (data && data.length > 0) {
                console.log(`Created category: ${category.name}`);
                categoryMap[category.name] = data[0].id;
            }
        }

        // Create subcategories with parent_id references
        console.log('Creating subcategories...');

        for (const subcategory of subcategories) {
            const parentId = categoryMap[subcategory.parent_name];

            if (!parentId) {
                console.error(`Parent category "${subcategory.parent_name}" not found for subcategory "${subcategory.name}"`);
                continue;
            }

            const subcategoryData = {
                name: subcategory.name,
                name_ar: subcategory.name_ar,
                slug: subcategory.slug,
                image: subcategory.image,
                parent_id: parentId
            };

            const { data, error } = await supabase
                .from('categories')
                .insert([subcategoryData])
                .select();

            if (error) {
                console.error(`Error creating subcategory ${subcategory.name}:`, error);
            } else if (data && data.length > 0) {
                console.log(`Created subcategory: ${subcategory.name} (under ${subcategory.parent_name})`);
            }
        }

        console.log('Category seeding complete!');

    } catch (error) {
        console.error('Error in seedCategories:', error);
    }
}

// Run the script
seedCategories()
    .catch(error => {
        console.error('Script error:', error);
    });