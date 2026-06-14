const express    = require('express');
const router    = express.Router();
const Order     = require('../models/Order');
const Inventory = require('../models/Inventory');
const { protect, adminOnly } = require('../middleware/authMiddleware');


router.get('/orders', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order
      .find()
      .populate('userId', 'name email')  
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/orders/:id', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }  
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/inventory', protect, adminOnly, async (req, res) => {
  try {
    const items = await Inventory.find().sort({ category: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/inventory/:id', protect, adminOnly, async (req, res) => {
  try {
    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      { quantity: req.body.quantity },
      { new: true }
    );
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/inventory/seed', protect, adminOnly, async (req, res) => {
  try {
    await Inventory.deleteMany();  
    const items = [
      // bases
      { name: 'Thin Crust',    category: 'base',   quantity: 100, threshold: 20 },
      { name: 'Thick Crust',   category: 'base',   quantity: 100, threshold: 20 },
      { name: 'Cheese Burst',  category: 'base',   quantity: 100, threshold: 20 },
      { name: 'Whole Wheat',   category: 'base',   quantity: 100, threshold: 20 },
      { name: 'Gluten Free',   category: 'base',   quantity: 100, threshold: 20 },
      // sauces
      { name: 'Tomato',        category: 'sauce',  quantity: 100, threshold: 20 },
      { name: 'White Sauce',   category: 'sauce',  quantity: 100, threshold: 20 },
      { name: 'BBQ',           category: 'sauce',  quantity: 100, threshold: 20 },
      { name: 'Pesto',         category: 'sauce',  quantity: 100, threshold: 20 },
      // cheeses
      { name: 'Mozzarella',    category: 'cheese', quantity: 100, threshold: 20 },
      { name: 'Cheddar',       category: 'cheese', quantity: 100, threshold: 20 },
      { name: 'Parmesan',      category: 'cheese', quantity: 100, threshold: 20 },
      // veggies
      { name: 'Onion',         category: 'veggie', quantity: 100, threshold: 20 },
      { name: 'Capsicum',      category: 'veggie', quantity: 100, threshold: 20 },
      { name: 'Mushroom',      category: 'veggie', quantity: 100, threshold: 20 },
      { name: 'Olives',        category: 'veggie', quantity: 100, threshold: 20 },
    ];
    await Inventory.insertMany(items);
    res.json({ message: 'Inventory seeded!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;