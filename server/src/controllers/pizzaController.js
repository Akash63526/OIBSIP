const Pizza = require('../models/Pizza');
const { successResponse } = require('../utils/responseFormatter');
const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');

exports.getAllPizzas = asyncHandler(async (req, res) => {
  const pizzas = await Pizza.find({ isAvailable: true }).sort('-createdAt');
  successResponse(res, 200, 'Pizzas fetched successfully', pizzas);
});

exports.getPizzaById = asyncHandler(async (req, res) => {
  const pizza = await Pizza.findById(req.params.id);
  if (!pizza) throw new ApiError(404, 'Pizza not found');
  successResponse(res, 200, 'Pizza fetched successfully', pizza);
});

exports.createPizza = asyncHandler(async (req, res) => {
  if (req.file) {
    req.body.image = req.file.path.startsWith('http') 
      ? req.file.path 
      : `/images/pizzas/${req.file.filename}`;
  }
  const pizza = await Pizza.create(req.body);
  successResponse(res, 201, 'Pizza created successfully', pizza);
});

exports.updatePizza = asyncHandler(async (req, res) => {
  if (req.file) {
    req.body.image = req.file.path.startsWith('http') 
      ? req.file.path 
      : `/images/pizzas/${req.file.filename}`;
  }
  const pizza = await Pizza.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!pizza) throw new ApiError(404, 'Pizza not found');
  successResponse(res, 200, 'Pizza updated successfully', pizza);
});

exports.deletePizza = asyncHandler(async (req, res) => {
  const pizza = await Pizza.findByIdAndDelete(req.params.id);
  if (!pizza) throw new ApiError(404, 'Pizza not found');
  successResponse(res, 200, 'Pizza deleted successfully');
});
