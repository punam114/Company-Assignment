require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../src/models/Product');

/**
 * Fake Product Data Generator
 * Generates 1000+ realistic products for testing
 */

// Product data templates
const brands = {
    mobile: ['Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Realme', 'Oppo', 'Vivo', 'Motorola', 'Nokia', 'Google'],
    laptop: ['Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'Apple', 'MSI', 'Samsung'],
    accessory: ['Boat', 'JBL', 'Sony', 'Anker', 'Belkin', 'Mi', 'Realme', 'OnePlus']
};

const mobileModels = [
    'Pro Max', 'Pro', 'Ultra', 'Plus', 'Lite', 'SE', 'Mini', 'Edge', 'Note', 'Prime'
];

const laptopModels = [
    'Inspiron', 'Pavilion', 'IdeaPad', 'VivoBook', 'Aspire', 'ThinkPad', 'MacBook', 'ZenBook'
];

const accessories = [
    'Wireless Earbuds', 'Power Bank', 'Phone Case', 'Screen Protector', 'Charger',
    'USB Cable', 'Wireless Charger', 'Car Charger', 'Headphones', 'Bluetooth Speaker'
];

const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Silver', 'Gold', 'Pink', 'Purple', 'Grey'];

const ramOptions = ['4GB', '6GB', '8GB', '12GB', '16GB', '32GB'];
const storageOptions = ['64GB', '128GB', '256GB', '512GB', '1TB', '2TB'];
const screenSizes = {
    mobile: ['5.5 inch', '6.1 inch', '6.4 inch', '6.7 inch', '6.9 inch'],
    laptop: ['13.3 inch', '14 inch', '15.6 inch', '16 inch', '17.3 inch']
};

/**
 * Generates random number between min and max
 */
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Picks random item from array
 */
const randomPick = (arr) => arr[randomInt(0, arr.length - 1)];

/**
 * Generates a mobile phone product
 */
const generateMobile = (index) => {
    const brand = randomPick(brands.mobile);
    const model = randomPick(mobileModels);
    const ram = randomPick(ramOptions.slice(0, 4)); // 4GB to 12GB
    const storage = randomPick(storageOptions.slice(0, 4)); // 64GB to 512GB
    const color = randomPick(colors);
    const screenSize = randomPick(screenSizes.mobile);

    const basePrice = randomInt(8000, 150000);
    const mrp = Math.round(basePrice * 1.15); // 15% discount
    const rating = (randomInt(30, 50) / 10).toFixed(1); // 3.0 to 5.0
    const stock = randomInt(0, 100);
    const sales = randomInt(10, 5000);

    return {
        title: `${brand} ${model} (${ram}/${storage}, ${color})`,
        description: `${brand} ${model} smartphone with ${ram} RAM, ${storage} storage, ${screenSize} display. Available in ${color} color. Perfect for Tier-2 and Tier-3 cities.`,
        price: basePrice,
        mrp: mrp,
        rating: parseFloat(rating),
        stock: stock,
        sales: sales,
        metadata: {
            brand: brand,
            model: model,
            category: 'mobile',
            ram: ram,
            storage: storage,
            color: color,
            screenSize: screenSize,
            brightness: `${randomInt(400, 2000)} nits`,
            battery: `${randomInt(3000, 6000)}mAh`,
            camera: `${randomInt(12, 108)}MP`,
            os: brand === 'Apple' ? 'iOS' : 'Android',
            processor: brand === 'Apple' ? `A${randomInt(14, 17)} Bionic` : `Snapdragon ${randomInt(600, 8)} Gen ${randomInt(1, 2)}`
        }
    };
};

/**
 * Generates a laptop product
 */
const generateLaptop = (index) => {
    const brand = randomPick(brands.laptop);
    const model = randomPick(laptopModels);
    const ram = randomPick(ramOptions.slice(2, 6)); // 8GB to 32GB
    const storage = randomPick(storageOptions.slice(2, 6)); // 256GB to 2TB
    const color = randomPick(['Silver', 'Black', 'Grey', 'White']);
    const screenSize = randomPick(screenSizes.laptop);

    const basePrice = randomInt(25000, 200000);
    const mrp = Math.round(basePrice * 1.12); // 12% discount
    const rating = (randomInt(35, 50) / 10).toFixed(1);
    const stock = randomInt(0, 50);
    const sales = randomInt(5, 2000);

    return {
        title: `${brand} ${model} ${ram}/${storage} ${screenSize} Laptop`,
        description: `${brand} ${model} laptop with ${ram} RAM, ${storage} SSD, ${screenSize} display. Ideal for work and entertainment. ${color} color.`,
        price: basePrice,
        mrp: mrp,
        rating: parseFloat(rating),
        stock: stock,
        sales: sales,
        metadata: {
            brand: brand,
            model: model,
            category: 'laptop',
            ram: ram,
            storage: storage,
            color: color,
            screenSize: screenSize,
            processor: brand === 'Apple' ? 'M1/M2' : `Intel Core i${randomInt(3, 9)}`,
            os: brand === 'Apple' ? 'macOS' : 'Windows 11',
            battery: `${randomInt(40, 100)}Wh`
        }
    };
};

/**
 * Generates an accessory product
 */
const generateAccessory = (index) => {
    const brand = randomPick(brands.accessory);
    const accessory = randomPick(accessories);
    const color = randomPick(colors);

    const basePrice = randomInt(299, 15000);
    const mrp = Math.round(basePrice * 1.20); // 20% discount
    const rating = (randomInt(30, 50) / 10).toFixed(1);
    const stock = randomInt(0, 200);
    const sales = randomInt(50, 10000);

    return {
        title: `${brand} ${accessory} - ${color}`,
        description: `Premium ${accessory} from ${brand}. High quality, durable, and stylish. Available in ${color} color. Great value for money.`,
        price: basePrice,
        mrp: mrp,
        rating: parseFloat(rating),
        stock: stock,
        sales: sales,
        metadata: {
            brand: brand,
            category: 'accessory',
            color: color,
            model: accessory
        }
    };
};

/**
 * Main function to generate and insert products
 */
const generateProducts = async () => {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Clear existing products
        console.log('🗑️  Clearing existing products...');
        await Product.deleteMany({});
        console.log('✅ Cleared existing products\n');

        const products = [];

        // Generate 500 mobiles
        console.log('📱 Generating 500 mobile phones...');
        for (let i = 0; i < 500; i++) {
            products.push(generateMobile(i));
        }

        // Generate 300 laptops
        console.log('💻 Generating 300 laptops...');
        for (let i = 0; i < 300; i++) {
            products.push(generateLaptop(i));
        }

        // Generate 200 accessories
        console.log('🎧 Generating 200 accessories...');
        for (let i = 0; i < 200; i++) {
            products.push(generateAccessory(i));
        }

        // Insert all products
        console.log('\n💾 Inserting products into database...');
        await Product.insertMany(products);

        console.log(`\n✅ Successfully generated ${products.length} products!`);
        console.log('\n📊 Breakdown:');
        console.log('   - Mobiles: 500');
        console.log('   - Laptops: 300');
        console.log('   - Accessories: 200');
        console.log('   - Total: 1000\n');

        // Show some stats
        const stats = await Product.aggregate([
            {
                $group: {
                    _id: '$metadata.category',
                    count: { $sum: 1 },
                    avgPrice: { $avg: '$price' },
                    avgRating: { $avg: '$rating' }
                }
            }
        ]);

        console.log('📈 Category Statistics:');
        stats.forEach(stat => {
            console.log(`   ${stat._id}:`);
            console.log(`      Count: ${stat.count}`);
            console.log(`      Avg Price: ₹${Math.round(stat.avgPrice)}`);
            console.log(`      Avg Rating: ${stat.avgRating.toFixed(2)}`);
        });

        console.log('\n🎉 Data generation complete!\n');

        process.exit(0);

    } catch (error) {
        console.error('❌ Error generating products:', error);
        process.exit(1);
    }
};

// Run the generator
generateProducts();
