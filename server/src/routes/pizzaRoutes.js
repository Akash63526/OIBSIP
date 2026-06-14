const express = require('express');
const router = express.Router();
const pizzaController = require('../controllers/pizzaController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.route('/')
  .get(pizzaController.getAllPizzas)
  .post(protect, authorize('admin'), upload.single('image'), pizzaController.createPizza);

router.route('/:id')
  .get(pizzaController.getPizzaById)
  .put(protect, authorize('admin'), upload.single('image'), pizzaController.updatePizza)
  .delete(protect, authorize('admin'), pizzaController.deletePizza);

module.exports = router;
