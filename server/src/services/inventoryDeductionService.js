const Inventory = require('../models/Inventory');
const Ingredient = require('../models/Ingredient');
const logger = require('../utils/logger');

// ─── Category Mapping ────────────────────────────────────────
// Maps Ingredient categories to Inventory categories
const INGREDIENT_TO_INVENTORY_CATEGORY = {
  'crust': 'Pizza Base',
  'sauce': 'Sauce',
  'cheese': 'Cheese',
  'veg-topping': 'Veggies',
  'meat-topping': 'Meat',
};

// ─── Deduct Stock for Order ──────────────────────────────────
// Called after payment is verified. Iterates over order items,
// resolves ingredient → inventory mapping, and decrements stock.
// Returns an array of Inventory items that fell below their threshold.
exports.deductStockForOrder = async (order) => {
  const lowStockItems = [];

  for (const item of order.items) {
    const qty = item.quantity || 1;

    if (item.isCustom && item.pizzaConfig) {
      // ── Custom Pizza: resolve each ingredient ID ──
      const ingredientIds = [];

      if (item.pizzaConfig.base) ingredientIds.push(item.pizzaConfig.base);
      if (item.pizzaConfig.sauce) ingredientIds.push(item.pizzaConfig.sauce);
      if (item.pizzaConfig.cheese) ingredientIds.push(item.pizzaConfig.cheese);
      if (item.pizzaConfig.veggies && item.pizzaConfig.veggies.length > 0) {
        ingredientIds.push(...item.pizzaConfig.veggies);
      }
      if (item.pizzaConfig.meat && item.pizzaConfig.meat.length > 0) {
        ingredientIds.push(...item.pizzaConfig.meat);
      }

      // Resolve ingredient documents to get names + categories
      const ingredients = await Ingredient.find({ _id: { $in: ingredientIds } }).lean();

      for (const ing of ingredients) {
        const inventoryCategory = INGREDIENT_TO_INVENTORY_CATEGORY[ing.category];
        if (!inventoryCategory) {
          logger.warn(`⚠️ No inventory category mapping for ingredient "${ing.name}" (${ing.category})`);
          continue;
        }

        // Find matching inventory item by name similarity or category
        const inventoryItem = await Inventory.findOneAndUpdate(
          {
            itemName: { $regex: new RegExp(ing.name, 'i') },
            stock: { $gte: qty },
          },
          { $inc: { stock: -qty } },
          { new: true }
        );

        if (inventoryItem) {
          logger.info(`📉 Deducted ${qty} from "${inventoryItem.itemName}" (stock: ${inventoryItem.stock})`);

          // Check if below threshold
          if (inventoryItem.stock <= inventoryItem.threshold) {
            lowStockItems.push(inventoryItem);
          }
        } else {
          // Try by category as fallback — deduct from first matching item in that category
          const fallbackItem = await Inventory.findOneAndUpdate(
            {
              category: inventoryCategory,
              stock: { $gte: qty },
            },
            { $inc: { stock: -qty } },
            { new: true }
          );

          if (fallbackItem) {
            logger.info(`📉 Deducted ${qty} from "${fallbackItem.itemName}" (category fallback, stock: ${fallbackItem.stock})`);
            if (fallbackItem.stock <= fallbackItem.threshold) {
              lowStockItems.push(fallbackItem);
            }
          } else {
            logger.warn(`⚠️ Could not find inventory to deduct for ingredient "${ing.name}" (${inventoryCategory})`);
          }
        }
      }
    } else if (item.pizzaId) {
      // ── Standard Menu Pizza ──
      // For standard pizzas, deduct a generic unit from each base category
      // since we don't track exact ingredient refs for menu items
      const baseCategories = ['Pizza Base', 'Sauce', 'Cheese'];

      for (const category of baseCategories) {
        const inventoryItem = await Inventory.findOneAndUpdate(
          {
            category,
            stock: { $gte: qty },
          },
          { $inc: { stock: -qty } },
          { new: true, sort: { stock: -1 } } // Deduct from highest stock item
        );

        if (inventoryItem) {
          logger.info(`📉 Deducted ${qty} from "${inventoryItem.itemName}" (standard pizza, stock: ${inventoryItem.stock})`);
          if (inventoryItem.stock <= inventoryItem.threshold) {
            lowStockItems.push(inventoryItem);
          }
        }
      }
    }
  }

  // Deduplicate low stock items (same item might appear multiple times)
  const uniqueLowStock = [];
  const seenIds = new Set();
  for (const item of lowStockItems) {
    if (!seenIds.has(item._id.toString())) {
      seenIds.add(item._id.toString());
      uniqueLowStock.push(item);
    }
  }

  return uniqueLowStock;
};
