// This script uploads sample images to Supabase Storage
// Run with: node src/scripts/s3-image-upload.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Configuration
const LOCAL_IMAGE_DIR = path.join(__dirname, '../../public/sample-images');
const BUCKET_NAME = 'arabesque-ecommerce';
const CATEGORIES_FOLDER = 'categories';
const PRODUCTS_FOLDER = 'products';

async function uploadImages() {
    try {
        console.log('Starting image upload to Supabase Storage...');

        // Check if bucket exists, create if it doesn't
        const { data: buckets } = await supabase.storage.listBuckets();
        const bucketExists = buckets.some(bucket => bucket.name === BUCKET_NAME);

        if (!bucketExists) {
            console.log(`Creating bucket: ${BUCKET_NAME}`);
            const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
                public: true,
                fileSizeLimit: 5242880, // 5MB
            });

            if (error) {
                throw new Error(`Error creating bucket: ${error.message}`);
            }
        }

        // Ensure folders exist
        await ensureFolderExists(CATEGORIES_FOLDER);
        await ensureFolderExists(PRODUCTS_FOLDER);

        // Check if the local directory exists
        if (!fs.existsSync(LOCAL_IMAGE_DIR)) {
            console.log(`Local image directory not found: ${LOCAL_IMAGE_DIR}`);
            console.log('Creating sample directory structure...');

            // Create directory structure
            fs.mkdirSync(LOCAL_IMAGE_DIR, { recursive: true });
            fs.mkdirSync(path.join(LOCAL_IMAGE_DIR, CATEGORIES_FOLDER), { recursive: true });
            fs.mkdirSync(path.join(LOCAL_IMAGE_DIR, PRODUCTS_FOLDER), { recursive: true });

            console.log('Sample directory structure created. Please add your images to these folders:');
            console.log(`- ${path.join(LOCAL_IMAGE_DIR, CATEGORIES_FOLDER)}`);
            console.log(`- ${path.join(LOCAL_IMAGE_DIR, PRODUCTS_FOLDER)}`);
            console.log('Then run this script again to upload them.');
            return;
        }

        // Upload category images
        const categoryImagesDir = path.join(LOCAL_IMAGE_DIR, CATEGORIES_FOLDER);
        if (fs.existsSync(categoryImagesDir)) {
            await uploadImagesFromDirectory(categoryImagesDir, CATEGORIES_FOLDER);
        }

        // Upload product images
        const productImagesDir = path.join(LOCAL_IMAGE_DIR, PRODUCTS_FOLDER);
        if (fs.existsSync(productImagesDir)) {
            await uploadImagesFromDirectory(productImagesDir, PRODUCTS_FOLDER);
        }

        console.log('Image upload complete!');

        // Display the base URLs for use in seed scripts
        console.log('\nUse these base URLs in your seed scripts:');
        console.log(`Categories: ${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/${CATEGORIES_FOLDER}/`);
        console.log(`Products: ${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/${PRODUCTS_FOLDER}/`);

    } catch (error) {
        console.error('Error uploading images:', error);
    }
}

async function ensureFolderExists(folderName) {
    try {
        // Check if the folder exists by listing its contents
        const { data } = await supabase.storage.from(BUCKET_NAME).list(folderName);

        // If listing doesn't error, the folder exists
        console.log(`Folder exists: ${folderName}`);
        return true;
    } catch (error) {
        // Create an empty file to ensure the folder exists
        console.log(`Creating folder: ${folderName}`);
        const { error: uploadError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(`${folderName}/.placeholder`, Buffer.from(''));

        if (uploadError && !uploadError.message.includes('already exists')) {
            throw new Error(`Error creating folder: ${uploadError.message}`);
        }

        return true;
    }
}

async function uploadImagesFromDirectory(directory, targetFolder) {
    const files = fs.readdirSync(directory);

    console.log(`Found ${files.length} files in ${directory}`);

    for (const file of files) {
        if (file.startsWith('.')) continue; // Skip hidden files

        const filePath = path.join(directory, file);
        const stats = fs.statSync(filePath);

        if (stats.isFile()) {
            // Check if file is an image
            const ext = path.extname(file).toLowerCase();
            if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
                console.log(`Uploading ${file} to ${targetFolder}...`);

                const fileContent = fs.readFileSync(filePath);
                const { error } = await supabase.storage
                    .from(BUCKET_NAME)
                    .upload(`${targetFolder}/${file}`, fileContent, {
                        contentType: getContentType(ext),
                        upsert: true
                    });

                if (error) {
                    console.error(`Error uploading ${file}: ${error.message}`);
                } else {
                    console.log(`Successfully uploaded ${file}`);
                }
            }
        }
    }
}

function getContentType(extension) {
    const types = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp'
    };

    return types[extension] || 'application/octet-stream';
}

// Run the script
uploadImages()
    .catch(error => {
        console.error('Script error:', error);
    });