const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('admin'));

router.route('/')
  .get(inventoryController.getAllInventory)
  .post(inventoryController.createInventoryItem);

router.route('/:id')
  .put(inventoryController.updateInventoryItem)
  .delete(inventoryController.deleteInventoryItem);

module.exports = router;
