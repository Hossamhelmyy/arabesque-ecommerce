
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { pipeline } from 'stream/promises';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const LOCAL_IMAGE_DIR = path.join(__dirname, '../../public/sample-images');
const CATEGORIES_FOLDER = 'categories';
const PRODUCTS_FOLDER = 'products';
const BUCKET_NAME = 'arabesque-ecommerce';

if (!globalThis.fetch) {
    throw new Error('This script requires Node.js v18+ with global fetch support.');
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const categoryFiles = {
    'furniture.jpg': 'arabesque furniture clean detailed',
    'pottery.jpg': 'moroccan pottery ceramic colorful',
    'textiles.jpg': 'moroccan textile pattern fabric',
    'lighting.jpg': 'moroccan lantern brass lamp glowing',
    'rugs.jpg': 'persian rug colorful floor',
    'decor.jpg': 'islamic home decor brass geometric',
    'tables.jpg': 'coffee table inlaid wood morocco',
    'chairs.jpg': 'chair wooden inlaid mother pearl',
    'cabinets.jpg': 'wooden cabinet carved geometric',
    'sofas.jpg': 'sofa arabic majlis seating',
    'vases.jpg': 'vase ceramic islamic pattern',
    'bowls.jpg': 'bowl ceramic hand painted',
    'plates.jpg': 'plate decorative ceramic wall',
    'cushions.jpg': 'cushion embroidered colorful',
    'throws.jpg': 'throw blanket woven texture',
    'tapestries.jpg': 'tapestry wall hanging woven',
    'pendant-lights.jpg': 'pendant light brass pierced',
    'table-lamps.jpg': 'table lamp mosaic glass',
    'floor-lamps.jpg': 'floor lamp brass tall',
    'lanterns.jpg': 'lantern candle holder metal',
    'area-rugs.jpg': 'area rug oriental pattern large',
    'runners.jpg': 'rug runner hallway long',
    'kilims.jpg': 'kilim rug flat weave geometric',
    'wall-art.jpg': 'wall art islamic wood carving',
    'mirrors.jpg': 'mirror frame wooden carved',
    'candle-holders.jpg': 'candle holder brass pair',
    'decorative-boxes.jpg': 'box wooden jewelry inlaid'
};

const productPatterns = [
    { prefix: 'furniture', count: 8, term: 'arabesque furniture' },
    { prefix: 'pottery', count: 8, term: 'islamic pottery ceramic' },
    { prefix: 'textile', count: 8, term: 'oriental fabric pattern' },
    { prefix: 'lamp', count: 8, term: 'moroccan lamp lighting' },
    { prefix: 'rug', count: 8, term: 'oriental rug detail' },
    { prefix: 'decor', count: 8, term: 'islamic home decoration' }
];

async function downloadImage(filename, term, folder) {
    const destPath = path.join(LOCAL_IMAGE_DIR, folder, filename);

    // Skip valid existing files (size > 3KB)
    if (fs.existsSync(destPath)) {
        const stats = fs.statSync(destPath);
        if (stats.size > 3000) {
            console.log(`Skipping ${filename} (already exists)`);
            return;
        }
    }

    const simpleTerm = term.replace(/variation \d+|distinct/gi, '').trim().split(' ').slice(0, 2).join(',');

    // Sources priority: Pollinations (AI) > LoremFlickr (Stock-like) > Placehold.co (Fallback)
    const sources = [
        {
            url: `https://image.pollinations.ai/prompt/${encodeURIComponent(term)}?width=800&height=600&nologo=true&seed=${Math.floor(Math.random() * 9999)}`,
            name: 'Pollinations AI'
        },
        {
            url: `https://loremflickr.com/800/600/${encodeURIComponent(simpleTerm)}?lock=${Math.floor(Math.random() * 5000)}`,
            name: 'LoremFlickr'
        },
        {
            url: `https://placehold.co/800x600/png?text=${encodeURIComponent(simpleTerm.split(',').join('+'))}&font=lora`,
            name: 'Placehold.co'
        }
    ];

    for (const source of sources) {
        try {
            console.log(`Downloading ${filename} from ${source.name}...`);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

            const response = await fetch(source.url, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (!response.ok) throw new Error(`Status ${response.status}`);

            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            if (buffer.length < 1000) throw new Error('File too small');

            const header = buffer.subarray(0, 20).toString().toLowerCase();
            if (header.includes('<html') || header.includes('<!doctype')) {
                throw new Error('Received HTML instead of image');
            }

            await fs.promises.writeFile(destPath, buffer);
            console.log(`Saved ${filename}`);
            await sleep(1500);
            return;
        } catch (error) {
            console.error(`Error downloading from ${source.name}: ${error.message}`);
            await sleep(500);
        }
    }
    console.error(`Failed to download ${filename}`);
}

async function uploadFileToSupabase(filename, folder) {
    const filePath = path.join(LOCAL_IMAGE_DIR, folder, filename);
    if (!fs.existsSync(filePath)) return;

    const fileContent = await fs.promises.readFile(filePath);
    const ext = path.extname(filename).toLowerCase();
    let mimeType = 'image/jpeg';
    if (ext === '.png') mimeType = 'image/png';
    else if (ext === '.webp') mimeType = 'image/webp';

    let retries = 3;
    while (retries > 0) {
        try {
            const { error } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(`${folder}/${filename}`, fileContent, {
                    contentType: mimeType,
                    upsert: true
                });

            if (error) throw error;
            console.log(`Uploaded ${folder}/${filename}`);
            break;
        } catch (error) {
            console.error(`Upload error ${filename}:`, error.message);
            retries--;
            if (retries === 0) console.error(`Failed to upload ${filename}`);
            await sleep(1000);
        }
    }
}

async function main() {
    console.log('--- Starting Image Setup ---');
    fs.mkdirSync(path.join(LOCAL_IMAGE_DIR, CATEGORIES_FOLDER), { recursive: true });
    fs.mkdirSync(path.join(LOCAL_IMAGE_DIR, PRODUCTS_FOLDER), { recursive: true });

    console.log('\n--- Downloading Category Images ---');
    for (const [filename, term] of Object.entries(categoryFiles)) {
        await downloadImage(filename, term, CATEGORIES_FOLDER);
    }

    console.log('\n--- Downloading Product Images ---');
    for (const group of productPatterns) {
        for (let i = 1; i <= group.count; i++) {
            const filename = `${group.prefix}-${i}.jpg`;
            const term = `${group.term} type ${i}`;
            await downloadImage(filename, term, PRODUCTS_FOLDER);
        }
    }

    console.log('\n--- Uploading to Supabase ---');
    const { data: buckets } = await supabase.storage.listBuckets();
    if (buckets && !buckets.some(b => b.name === BUCKET_NAME)) {
        await supabase.storage.createBucket(BUCKET_NAME, { public: true });
    }

    const catFiles = fs.readdirSync(path.join(LOCAL_IMAGE_DIR, CATEGORIES_FOLDER));
    for (const file of catFiles) {
        await uploadFileToSupabase(file, CATEGORIES_FOLDER);
    }

    const prodFiles = fs.readdirSync(path.join(LOCAL_IMAGE_DIR, PRODUCTS_FOLDER));
    for (let i = 0; i < prodFiles.length; i += 5) { // Chunk upload
        const chunk = prodFiles.slice(i, i + 5);
        await Promise.all(chunk.map(file => uploadFileToSupabase(file, PRODUCTS_FOLDER)));
    }

    console.log('\n--- Complete ---');
}

main().catch(console.error);
