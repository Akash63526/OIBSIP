require('dotenv').config();
const mongoose = require('mongoose');
const Menu = require('../models/Menu');
const Ingredient = require('../models/Ingredient');
const Inventory = require('../models/Inventory');
const config = require('../config/env');

const INGREDIENTS_DATA = [
  // Bases (crust)
  { name: 'Classic Hand Tossed', category: 'crust', image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=150&q=80', extraPrice: 0, isVeg: true, displayOrder: 1 },
  { name: 'Cheese Burst', category: 'crust', image: 'https://images.unsplash.com/photo-1571066811602-71683a3f680d?auto=format&fit=crop&w=150&q=80', extraPrice: 120, isVeg: true, displayOrder: 2 },
  { name: 'Wheat Thin Crust', category: 'crust', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=150&q=80', extraPrice: 80, isVeg: true, displayOrder: 3 },
  { name: 'Pan Pizza', category: 'crust', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=150&q=80', extraPrice: 100, isVeg: true, displayOrder: 4 },
  { name: 'Stuffed Crust', category: 'crust', image: 'https://images.unsplash.com/photo-1571066811602-71683a3f680d?auto=format&fit=crop&w=150&q=80', extraPrice: 140, isVeg: true, displayOrder: 5 },

  // Sauces
  { name: 'Tomato Basil', category: 'sauce', image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=150&q=80', extraPrice: 0, isVeg: true, displayOrder: 1 },
  { name: 'BBQ Sauce', category: 'sauce', image: 'https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?auto=format&fit=crop&w=150&q=80', extraPrice: 0, isVeg: true, displayOrder: 2 },
  { name: 'Alfredo Sauce', category: 'sauce', image: 'https://images.unsplash.com/photo-1579631542720-3a87824ffd8a?auto=format&fit=crop&w=150&q=80', extraPrice: 0, isVeg: true, displayOrder: 3 },
  { name: 'Pesto Sauce', category: 'sauce', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=150&q=80', extraPrice: 0, isVeg: true, displayOrder: 4 },
  { name: 'Spicy Arrabbiata', category: 'sauce', image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=150&q=80', extraPrice: 0, isVeg: true, displayOrder: 5 },

  // Cheeses
  { name: 'Mozzarella', category: 'cheese', image: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=150&q=80', extraPrice: 0, isVeg: true, displayOrder: 1 },
  { name: 'Cheddar', category: 'cheese', image: 'https://images.unsplash.com/photo-1618164435735-6e3e5178673b?auto=format&fit=crop&w=150&q=80', extraPrice: 0, isVeg: true, displayOrder: 2 },
  { name: 'Parmesan', category: 'cheese', image: 'https://images.unsplash.com/photo-1552763407-36c6454943f1?auto=format&fit=crop&w=150&q=80', extraPrice: 0, isVeg: true, displayOrder: 3 },
  { name: 'Vegan Cheese', category: 'cheese', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=150&q=80', extraPrice: 0, isVeg: true, displayOrder: 4 },
  { name: 'Extra Cheese', category: 'cheese', image: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=150&q=80', extraPrice: 50, isVeg: true, displayOrder: 5 },

  // Veggies (veg-topping)
  { name: 'Onion', category: 'veg-topping', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=150&q=80', extraPrice: 20, isVeg: true, displayOrder: 1 },
  { name: 'Capsicum', category: 'veg-topping', image: 'https://images.unsplash.com/photo-1563565088990-dd284d3343c1?auto=format&fit=crop&w=150&q=80', extraPrice: 20, isVeg: true, displayOrder: 2 },
  { name: 'Mushroom', category: 'veg-topping', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=150&q=80', extraPrice: 30, isVeg: true, displayOrder: 3 },
  { name: 'Black Olive', category: 'veg-topping', image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=150&q=80', extraPrice: 30, isVeg: true, displayOrder: 4 },
  { name: 'Jalapeno', category: 'veg-topping', image: 'https://images.unsplash.com/photo-1563565088990-dd284d3343c1?auto=format&fit=crop&w=150&q=80', extraPrice: 25, isVeg: true, displayOrder: 5 },
  { name: 'Sweet Corn', category: 'veg-topping', image: 'https://images.unsplash.com/photo-1551754625-70c904875f57?auto=format&fit=crop&w=150&q=80', extraPrice: 20, isVeg: true, displayOrder: 6 },
  { name: 'Tomato', category: 'veg-topping', image: 'https://images.unsplash.com/photo-1563565088990-dd284d3343c1?auto=format&fit=crop&w=150&q=80', extraPrice: 20, isVeg: true, displayOrder: 7 },
  { name: 'Spinach', category: 'veg-topping', image: 'https://images.unsplash.com/photo-1551754625-70c904875f57?auto=format&fit=crop&w=150&q=80', extraPrice: 20, isVeg: true, displayOrder: 8 },
  { name: 'Paneer Cubes', category: 'veg-topping', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=150&q=80', extraPrice: 40, isVeg: true, displayOrder: 9 },

  // Meats (meat-topping)
  { name: 'Chicken Chunks', category: 'meat-topping', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=150&q=80', extraPrice: 60, isVeg: false, displayOrder: 1 },
  { name: 'Chicken Pepperoni', category: 'meat-topping', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=150&q=80', extraPrice: 80, isVeg: false, displayOrder: 2 },
  { name: 'Chicken Sausage', category: 'meat-topping', image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=150&q=80', extraPrice: 60, isVeg: false, displayOrder: 3 },
  { name: 'Chicken Bacon', category: 'meat-topping', image: 'https://images.unsplash.com/photo-1606851282885-c1fc35728876?auto=format&fit=crop&w=150&q=80', extraPrice: 80, isVeg: false, displayOrder: 4 },
  { name: 'Ground Beef', category: 'meat-topping', image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=150&q=80', extraPrice: 80, isVeg: false, displayOrder: 5 }
];

const INVENTORY_CATEGORY_MAP = {
  'crust': 'Pizza Base',
  'sauce': 'Sauce',
  'cheese': 'Cheese',
  'veg-topping': 'Veggies',
  'meat-topping': 'Meat'
};

const GENERIC_INVENTORY = [
  { itemName: 'Standard Pizza Base', category: 'Pizza Base', stock: 500, threshold: 50, unitPrice: 20 },
  { itemName: 'Standard Pizza Sauce', category: 'Sauce', stock: 500, threshold: 50, unitPrice: 10 },
  { itemName: 'Standard Pizza Cheese', category: 'Cheese', stock: 500, threshold: 50, unitPrice: 30 }
];

const MENU_ITEMS = [
  {
    name: 'Veggie Delight Pizza',
    description: 'A delightful mix of fresh veggies on a classic crust.',
    image: 'https://images.unsplash.com/photo-1571066811602-71683a3f680d?auto=format&fit=crop&w=600&q=80',
    category: 'veg-pizza',
    basePrice: 249,
    isVeg: true,
    isBestSeller: false
  },
  {
    name: 'Pepperoni Pizza',
    description: 'Classic pepperoni slices with extra cheese.',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80',
    category: 'nonveg-pizza',
    basePrice: 399,
    isVeg: false,
    isBestSeller: true
  },
  {
    name: 'Margherita Pizza',
    description: 'Simple and elegant classic tomato and mozzarella.',
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=600&q=80',
    category: 'veg-pizza',
    basePrice: 199,
    isVeg: true,
    isBestSeller: true
  },
  {
    name: 'BBQ Chicken Pizza',
    description: 'Smoky BBQ sauce, grilled chicken, and red onions.',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
    category: 'nonveg-pizza',
    basePrice: 449,
    isVeg: false,
    isBestSeller: false
  },
  {
    name: 'Vegan Supreme',
    description: 'Loaded with veggies and delicious vegan cheese.',
    image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=600&q=80',
    category: 'veg-pizza',
    basePrice: 299,
    isVeg: true,
    isBestSeller: false
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(config.mongoose.url);
    console.log('📦 Connected to MongoDB');

    await Promise.all([
      Ingredient.deleteMany({}),
      Inventory.deleteMany({}),
      Menu.deleteMany({})
    ]);
    console.log('🧹 Cleared existing collections');

    const ingredientsWithSlugs = INGREDIENTS_DATA.map(ing => ({
      ...ing,
      slug: ing.name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "")
    }));
    const insertedIngredients = await Ingredient.insertMany(ingredientsWithSlugs);
    console.log(`✅ Inserted ${insertedIngredients.length} ingredients`);

    const inventoryData = INGREDIENTS_DATA.map(ing => ({
      itemName: ing.name,
      category: INVENTORY_CATEGORY_MAP[ing.category],
      stock: 100,
      threshold: 20,
      unitPrice: 10
    }));
    inventoryData.push(...GENERIC_INVENTORY);

    const insertedInventory = await Inventory.insertMany(inventoryData);
    console.log(`✅ Inserted ${insertedInventory.length} inventory items`);

    const insertedMenu = await Menu.insertMany(MENU_ITEMS.map(m => ({
      ...m,
      slug: m.name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, ""),
      sizes: [{ name: 'medium', price: m.basePrice }]
    })));
    console.log(`✅ Inserted ${insertedMenu.length} menu items`);

    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
