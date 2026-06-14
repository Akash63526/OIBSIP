const express = require('express');
// We will uncomment these as we implement them in subsequent phases
const authRoutes = require('./authRoutes');
const pizzaRoutes = require('./pizzaRoutes');
const menuRoutes = require('./menuRoutes');
const ingredientRoutes = require('./ingredientRoutes');
const reviewRoutes = require('./reviewRoutes');
const couponRoutes = require('./couponRoutes');
const inventoryRoutes = require('./inventoryRoutes');
const orderRoutes = require('./orderRoutes');
const paymentRoutes = require('./paymentRoutes');
const adminRoutes = require('./adminRoutes');
const userRoutes = require('./userRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/pizzas', pizzaRoutes);
router.use('/menu', menuRoutes);
router.use('/ingredients', ingredientRoutes);
router.use('/reviews', reviewRoutes);
router.use('/coupons', couponRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/admin', adminRoutes);
router.use('/users', userRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running normally.' });
});

module.exports = router;
