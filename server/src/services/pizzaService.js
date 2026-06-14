const Pizza = require('../models/Pizza');

exports.getAllPizzas = async () => {
  return await Pizza.find({ isAvailable: true }).sort('-createdAt');
};

exports.getPizzaById = async (id) => {
  return await Pizza.findById(id);
};

exports.createPizza = async (pizzaData) => {
  return await Pizza.create(pizzaData);
};

exports.updatePizza = async (id, pizzaData) => {
  return await Pizza.findByIdAndUpdate(id, pizzaData, { new: true, runValidators: true });
};

exports.deletePizza = async (id) => {
  return await Pizza.findByIdAndDelete(id);
};
