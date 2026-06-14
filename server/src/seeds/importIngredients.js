const mongoose = require('mongoose');
const path = require('path');

// Load environment variables from the server root .env
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const Ingredient = require('../models/Ingredient');
const ingredientItems = require('./ingredientSeed');

const importIngredients = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pizza_delivery';
    
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully.');

    // Clear any existing ingredients
    console.log('Purging existing ingredients database items...');
    await Ingredient.deleteMany();
    console.log('Ingredients database items purged successfully.');

    // Seed the Ingredient collection
    console.log(`Seeding ${ingredientItems.length} ingredients into the database...`);
    const seededItems = await Ingredient.insertMany(ingredientItems);
    console.log(`Successfully seeded ${seededItems.length} ingredients!`);

    mongoose.connection.close();
    console.log('Database connection closed safely. Exiting.');
    process.exit(0);
  } catch (error) {
    console.error('Error importing ingredients:', error);
    process.exit(1);
  }
};

importIngredients();
