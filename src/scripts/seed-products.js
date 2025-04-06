// This script populates the Supabase database with sample products
// Run with: node src/scripts/seed-products.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Sample product image URLs (you can replace these with your actual image URLs)
const imageBaseUrl = 'https://arabesque-ecommerce.s3.amazonaws.com/products/';

// Images for different categories
const categoryImages = {
    // Furniture
    furniture: [
        'furniture-1.jpg', 'furniture-2.jpg', 'furniture-3.jpg', 'furniture-4.jpg',
        'furniture-5.jpg', 'furniture-6.jpg', 'furniture-7.jpg', 'furniture-8.jpg'
    ],
    // Pottery
    pottery: [
        'pottery-1.jpg', 'pottery-2.jpg', 'pottery-3.jpg', 'pottery-4.jpg',
        'pottery-5.jpg', 'pottery-6.jpg', 'pottery-7.jpg', 'pottery-8.jpg'
    ],
    // Textiles
    textiles: [
        'textile-1.jpg', 'textile-2.jpg', 'textile-3.jpg', 'textile-4.jpg',
        'textile-5.jpg', 'textile-6.jpg', 'textile-7.jpg', 'textile-8.jpg'
    ],
    // Lighting
    lighting: [
        'lamp-1.jpg', 'lamp-2.jpg', 'lamp-3.jpg', 'lamp-4.jpg',
        'lamp-5.jpg', 'lamp-6.jpg', 'lamp-7.jpg', 'lamp-8.jpg'
    ],
    // Rugs
    rugs: [
        'rug-1.jpg', 'rug-2.jpg', 'rug-3.jpg', 'rug-4.jpg',
        'rug-5.jpg', 'rug-6.jpg', 'rug-7.jpg', 'rug-8.jpg'
    ],
    // Decor
    decor: [
        'decor-1.jpg', 'decor-2.jpg', 'decor-3.jpg', 'decor-4.jpg',
        'decor-5.jpg', 'decor-6.jpg', 'decor-7.jpg', 'decor-8.jpg'
    ]
};

// Generate sample products
async function generateProducts() {
    try {
        // First, get all categories from the database
        const { data: categories, error: categoryError } = await supabase
            .from('categories')
            .select('id, name, slug');

        if (categoryError) {
            throw categoryError;
        }

        if (!categories || categories.length === 0) {
            console.log('No categories found. Please add categories first.');
            return;
        }

        console.log(`Found ${categories.length} categories. Generating products...`);

        // For each category, create 8-12 products
        for (const category of categories) {
            const categorySlug = category.slug;
            const categoryId = category.id;
            const categoryName = category.name;

            // Determine which image set to use based on category name or slug
            let imageSet = categoryImages.decor; // Default

            if (categorySlug.includes('furniture')) {
                imageSet = categoryImages.furniture;
            } else if (categorySlug.includes('pottery') || categorySlug.includes('ceramic')) {
                imageSet = categoryImages.pottery;
            } else if (categorySlug.includes('textile') || categorySlug.includes('fabric')) {
                imageSet = categoryImages.textiles;
            } else if (categorySlug.includes('light') || categorySlug.includes('lamp')) {
                imageSet = categoryImages.lighting;
            } else if (categorySlug.includes('rug') || categorySlug.includes('carpet')) {
                imageSet = categoryImages.rugs;
            } else if (categorySlug.includes('decor')) {
                imageSet = categoryImages.decor;
            }

            // Create 8-12 products for this category
            const numProducts = Math.floor(Math.random() * 5) + 8; // 8-12 products

            console.log(`Creating ${numProducts} products for category "${categoryName}"`);

            for (let i = 0; i < numProducts; i++) {
                // Generate unique product data
                const isNew = Math.random() > 0.7; // 30% chance of being new
                const isOnSale = Math.random() > 0.8; // 20% chance of being on sale

                // Calculate price
                const basePrice = Math.floor(Math.random() * 1500) + 50; // $50 to $1550
                const price = isOnSale
                    ? Math.floor(basePrice * 0.8) // 20% discount
                    : basePrice;
                const originalPrice = isOnSale ? basePrice : null;

                // Generate product name
                const productNumber = i + 1;
                const productName = `${categoryName} ${getRandomProductType(categorySlug)} ${productNumber}`;
                const productName_ar = `${getArabicName(categorySlug)} ${productNumber}`;

                // Generate slug
                const slug = `${categorySlug}-${getSlugifiedName(productName)}-${productNumber}`;

                // Generate stock quantity
                const stockQuantity = Math.floor(Math.random() * 20) + 5; // 5-24 items

                // Generate description
                const description = getRandomDescription(categorySlug);
                const description_ar = "وصف المنتج بالعربية"; // Arabic description placeholder

                // Select main image and additional images
                const numImagesToUse = Math.min(4, imageSet.length);
                const shuffledImages = shuffleArray([...imageSet]);
                const mainImage = imageBaseUrl + shuffledImages[0];

                // Select 1-3 additional images
                const additionalImages = [];
                for (let j = 1; j < numImagesToUse; j++) {
                    additionalImages.push(imageBaseUrl + shuffledImages[j]);
                }

                // Create the product object
                const product = {
                    name: productName,
                    name_ar: productName_ar,
                    slug: slug,
                    description: description,
                    description_ar: description_ar,
                    price: price,
                    original_price: originalPrice,
                    image: mainImage,
                    images: additionalImages,
                    stock_quantity: stockQuantity,
                    is_new: isNew,
                    is_on_sale: isOnSale,
                    category_id: categoryId,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };

                // Insert the product into the database
                const { data, error } = await supabase
                    .from('products')
                    .insert([product]);

                if (error) {
                    console.error(`Error inserting product ${productName}:`, error);
                } else {
                    console.log(`Created product: ${productName}`);
                }
            }
        }

        console.log('Product generation complete!');

    } catch (error) {
        console.error('Error generating products:', error);
    }
}

// Helper function to get a random product type based on category
function getRandomProductType(category) {
    const types = {
        furniture: ['Chair', 'Table', 'Cabinet', 'Shelf', 'Sofa', 'Bench', 'Stool', 'Ottoman'],
        pottery: ['Vase', 'Bowl', 'Plate', 'Pot', 'Jar', 'Mug', 'Planter', 'Sculpture'],
        textile: ['Pillow', 'Throw', 'Blanket', 'Cushion', 'Runner', 'Tapestry', 'Curtain'],
        lighting: ['Pendant', 'Lamp', 'Chandelier', 'Sconce', 'Lantern', 'Candle Holder'],
        rug: ['Area Rug', 'Runner', 'Carpet', 'Mat', 'Kilim', 'Floor Covering'],
        decor: ['Figurine', 'Wall Art', 'Mirror', 'Clock', 'Basket', 'Bookend', 'Tray', 'Vase']
    };

    // Find matching category
    let typeList = [];
    for (const key of Object.keys(types)) {
        if (category.includes(key)) {
            typeList = types[key];
            break;
        }
    }

    if (typeList.length === 0) {
        typeList = ['Item', 'Piece', 'Accessory', 'Design', 'Creation']; // Default
    }

    return typeList[Math.floor(Math.random() * typeList.length)];
}

// Helper function to convert English name to placeholder Arabic name
function getArabicName(category) {
    const arabicNames = {
        furniture: 'أثاث',
        pottery: 'فخار',
        textile: 'منسوجات',
        lighting: 'إضاءة',
        rug: 'سجاد',
        decor: 'ديكور'
    };

    for (const key of Object.keys(arabicNames)) {
        if (category.includes(key)) {
            return arabicNames[key];
        }
    }

    return 'عنصر'; // Default: "Item" in Arabic
}

// Helper function to create a slugified version of a name
function getSlugifiedName(name) {
    return name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Helper function to get random description based on category
function getRandomDescription(category) {
    const descriptions = {
        furniture: [
            "Handcrafted wooden furniture with intricate arabesque carvings, showcasing traditional craftsmanship with modern functionality.",
            "Elegant piece featuring geometric patterns and mother-of-pearl inlay work, bringing timeless beauty to your space.",
            "Featuring traditional joinery techniques and authentic arabesque designs, this piece combines beauty and durability."
        ],
        pottery: [
            "Hand-thrown ceramic with vibrant hand-painted designs inspired by ancient Islamic geometric patterns.",
            "Skillfully crafted pottery featuring a stunning glaze that highlights the intricate detail work.",
            "Authentic artisanal pottery combining traditional techniques with contemporary elegance."
        ],
        textile: [
            "Luxurious hand-woven textile made with natural dyes and traditional patterns that tell a story.",
            "Soft, premium fabric featuring intricate embroidery work created using time-honored techniques.",
            "Each piece is unique, showcasing elaborate patterns and exceptional attention to detail."
        ],
        lighting: [
            "Hand-pierced metal lamp casting intricate shadow patterns when illuminated, creating a magical atmosphere.",
            "Featuring delicate filigree work and colored glass inserts that create a warm, ambient glow.",
            "Traditional arabesque patterns combine with modern lighting technology for a stunning statement piece."
        ],
        rug: [
            "Hand-knotted wool rug featuring traditional motifs and elaborate border designs.",
            "Each rug takes months to complete, with skilled artisans weaving thousands of knots to create this durable masterpiece.",
            "Featuring natural dyes and traditional patterns that tell the story of a rich cultural heritage."
        ],
        decor: [
            "Intricately detailed decorative piece that serves as a stunning focal point in any room.",
            "Hand-crafted using traditional techniques passed down through generations of skilled artisans.",
            "Combining functionality with exquisite design, this piece exemplifies the elegance of arabesque aesthetics."
        ]
    };

    // Find matching category
    let descriptionList = [];
    for (const key of Object.keys(descriptions)) {
        if (category.includes(key)) {
            descriptionList = descriptions[key];
            break;
        }
    }

    if (descriptionList.length === 0) {
        descriptionList = descriptions.decor; // Default
    }

    return descriptionList[Math.floor(Math.random() * descriptionList.length)];
}

// Helper function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Run the script
generateProducts()
    .catch(error => {
        console.error('Script error:', error);
    });