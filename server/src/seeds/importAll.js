const mongoose = require('mongoose');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const Menu = require('../models/Menu');
const Ingredient = require('../models/Ingredient');
const Review = require('../models/Review');
const Coupon = require('../models/Coupon');

const menuItems = require('./menuSeed');
const ingredientItems = require('./ingredientSeed');
const couponItems = require('./couponSeed');
const reviewItems = require('./reviewSeed');

const importAll = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pizza_delivery';
    
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully.');

    // 1. Purge all collections
    console.log('Wiping Menu, Ingredient, Review, and Coupon collections...');
    await Menu.deleteMany();
    await Ingredient.deleteMany();
    await Review.deleteMany();
    await Coupon.deleteMany();
    console.log('Collections wiped clean.');

    // 2. Seed Coupons
    console.log(`Seeding ${couponItems.length} coupons...`);
    const seededCoupons = await Coupon.insertMany(couponItems);
    console.log(`Successfully seeded ${seededCoupons.length} coupons.`);

    // 3. Seed Ingredients
    console.log(`Seeding ${ingredientItems.length} custom ingredients...`);
    const seededIngredients = await Ingredient.create(ingredientItems);
    console.log(`Successfully seeded ${seededIngredients.length} ingredients.`);

    // 4. Seed Menu Items
    console.log(`Seeding ${menuItems.length} menu items...`);
    const seededMenu = await Menu.create(menuItems);
    console.log(`Successfully seeded ${seededMenu.length} menu items.`);

    // 5. Seed Reviews with Relational Safety
    console.log('Obtaining or creating a default seed User for reviews...');
    let user = await User.findOne();
    if (!user) {
      user = await User.create({
        name: 'Default Customer',
        email: 'customer@pizza.com',
        password: 'password123',
        role: 'user'
      });
      console.log('Created a default Reviewer user.');
    }

    // Resolve MenuItem references dynamically to prevent broken references
    const resolvedReviews = reviewItems.map(review => {
      // Try to find a menu item matching the review's product name
      const menuItem = seededMenu.find(item => 
        item.name.toLowerCase().includes(review.productName.toLowerCase()) ||
        review.productName.toLowerCase().includes(item.name.toLowerCase())
      );
      
      return {
        ...review,
        user: user._id,
        menuItem: menuItem ? menuItem._id : seededMenu[0]._id
      };
    });

    console.log(`Seeding ${resolvedReviews.length} customer reviews...`);
    const seededReviews = await Review.insertMany(resolvedReviews);
    console.log(`Successfully seeded ${seededReviews.length} reviews.`);

    mongoose.connection.close();
    console.log('All collections seeded successfully! Database connection closed safely.');
    process.exit(0);
  } catch (error) {
    console.error('Error importing seed data:', error);
    process.exit(1);
  }
};

importAll();
