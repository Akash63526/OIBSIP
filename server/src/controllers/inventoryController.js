const Inventory = require('../models/Inventory');
const { successResponse } = require('../utils/responseFormatter');
const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');

exports.getAllInventory = asyncHandler(async (req, res) => {
  const inventory = await Inventory.find().sort('category');
  successResponse(res, 200, 'Inventory fetched successfully', inventory);
});

exports.createInventoryItem = asyncHandler(async (req, res) => {
  const item = await Inventory.create(req.body);
  successResponse(res, 201, 'Inventory item created', item);
});

exports.updateInventoryItem = asyncHandler(async (req, res) => {
  const item = await Inventory.findByIdAndUpdate(
    req.params.id, 
    req.body, 
    { new: true, runValidators: true }
  );
  if (!item) throw new ApiError(404, 'Item not found');
  successResponse(res, 200, 'Inventory item updated', item);
});

exports.deleteInventoryItem = asyncHandler(async (req, res) => {
  const item = await Inventory.findByIdAndDelete(req.params.id);
  if (!item) throw new ApiError(404, 'Item not found');
  successResponse(res, 200, 'Inventory item deleted');
});
