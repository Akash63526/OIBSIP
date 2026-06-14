const mongoose = require('mongoose');
const path = require('path');

// Load environment variables from the server root .env
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const Menu = require('../models/Menu');
const menuItems = require('./menuSeed');

const importMenu = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pizza_delivery';
    
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully.');

    // Clear any existing menu items
    console.log('Purging existing menu database items...');
    await Menu.deleteMany();
    console.log('Menu database items purged successfully.');

    // Seed the Menu collection
    console.log(`Seeding ${menuItems.length} menu items into the database...`);
    const seededItems = await Menu.insertMany(menuItems);
    console.log(`Successfully seeded ${seededItems.length} menu items!`);

    mongoose.connection.close();
    console.log('Database connection closed safely. Exiting.');
    process.exit(0);
  } catch (error) {
    console.error('Error importing menu items:', error);
    process.exit(1);
  }
};

importMenu();
