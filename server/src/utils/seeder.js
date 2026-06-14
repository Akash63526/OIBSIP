const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Pizza = require('../models/Pizza');
const Inventory = require('../models/Inventory');

dotenv.config({ path: '../../.env' });

const pizzas = [
  { 
    name: 'Margherita Pizza', 
    description: 'Classic cheese and tomato', 
    category: 'Veg', 
    basePrice: 299, 
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=600&q=80', 
    availability: true 
  },
  { 
    name: 'Pepperoni Pizza', 
    description: 'Spicy pepperoni with mozzarella', 
    category: 'Non-Veg', 
    basePrice: 399, 
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80', 
    availability: true 
  },
];

const inventoryItems = [
  { itemName: 'Thin Crust', category: 'Pizza Base', stock: 18, threshold: 20, unitPrice: 20 },
  { itemName: 'Regular Crust', category: 'Pizza Base', stock: 56, threshold: 20, unitPrice: 20 },
  { itemName: 'Pan Crust', category: 'Pizza Base', stock: 32, threshold: 15, unitPrice: 25 },
  { itemName: 'Gluten Free Crust', category: 'Pizza Base', stock: 8, threshold: 10, unitPrice: 30 },
  { itemName: 'Tomato Basil Sauce', category: 'Sauce', stock: 5.2, threshold: 5, unitPrice: 10 },
  { itemName: 'BBQ Sauce', category: 'Sauce', stock: 12, threshold: 5, unitPrice: 15 },
  { itemName: 'Pesto Sauce', category: 'Sauce', stock: 7.5, threshold: 5, unitPrice: 15 },
  { itemName: 'Mozzarella Cheese', category: 'Cheese', stock: 9.5, threshold: 10, unitPrice: 30 },
  { itemName: 'Cheddar Cheese', category: 'Cheese', stock: 14, threshold: 10, unitPrice: 35 },
  { itemName: 'Bell Peppers', category: 'Veggies', stock: 15, threshold: 8, unitPrice: 15 },
  { itemName: 'Jalapenos', category: 'Veggies', stock: 2.1, threshold: 5, unitPrice: 15 },
  { itemName: 'Pepperoni', category: 'Meat', stock: 28, threshold: 15, unitPrice: 40 },
  { itemName: 'Grilled Chicken', category: 'Meat', stock: 4.8, threshold: 8, unitPrice: 40 }
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pizza-db';
    console.log(`Connecting to Mongo at: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('DB Connected for Seeding');

    await User.deleteMany();
    await Pizza.deleteMany();
    await Inventory.deleteMany();

    await Pizza.insertMany(pizzas);
    await Inventory.insertMany(inventoryItems);

    await User.create({
      name: 'Admin User',
      email: 'admin@pizza.com',
      password: 'password123',
      role: 'admin',
      isVerified: true
    });

    console.log('Data Imported Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

seedData();
