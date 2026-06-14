const Inventory = require('../models/Inventory');

exports.getAllItems = async () => {
  return await Inventory.find().sort('category');
};

exports.createItem = async (itemData) => {
  return await Inventory.create(itemData);
};

exports.updateItem = async (id, itemData) => {
  return await Inventory.findByIdAndUpdate(id, itemData, { new: true, runValidators: true });
};

exports.deleteItem = async (id) => {
  return await Inventory.findByIdAndDelete(id);
};
