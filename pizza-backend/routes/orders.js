const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Inventory = require("../models/Inventory");
const {protect} = require("../middleware/authMiddleware");
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const checkAndAlertLowStock = require('../utils/StockAlert');


router.post("/" , protect , async (req , res) => {
    try{
        const {base , sauce , cheese , veggies , totalPrice} = req.body;
         
        const order = await Order.create({
            userId: req.user.userId,
            base,sauce,cheese,veggies,totalPrice,
            status: "Order Received"
        });

        const ingredientsUsed = [
      { name: base,   category: 'base'   },
      { name: sauce,  category: 'sauce'  },
      { name: cheese, category: 'cheese' },
      ...veggies.map(v => ({ name: v, category: 'veggie' }))
    ];

      for (const { name, category } of ingredientsUsed) {
      await Inventory.findOneAndUpdate(
        { name, category },
        { $inc: { quantity: -1 } }  
      );
    }

    checkAndAlertLowStock(ingredientsUsed);

        res.json({ message: 'Order placed!', order });
    } catch (err) {
            res.status(500).json({ error: err.message });
        }

    });

    router.get("/myorders" , protect , async (req , res) => {
        try{
            const orders = await Order.find({userId: req.user.userId})
            .sort({createdAt: -1});
            res.json(orders);
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    });


    router.post('/create-payment-intent', protect, async (req, res) => {
  try {
    const { amount } = req.body; 

    const paymentIntent = await stripe.paymentIntents.create({
      amount:   amount * 100, 
      currency: 'pkr',         
      automatic_payment_methods: { enabled: true }
    });

    res.json({ clientSecret: paymentIntent.client_secret });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/place', protect, async (req, res) => {
  try {
    const { pizzaData, paymentIntentId } = req.body;

    const order = await Order.create({
      userId: req.user.userId,
      ...pizzaData,
      status: 'Order Received',
      paymentId: paymentIntentId
    });

    const ingredientsUsed = [
      { name: pizzaData.base, category: 'base' },
      { name: pizzaData.sauce, category: 'sauce' },
      { name: pizzaData.cheese, category: 'cheese' },
      ...pizzaData.veggies.map(v => ({
        name: v,
        category: 'veggie'
      }))
    ];

    for (const { name, category } of ingredientsUsed) {
      await Inventory.findOneAndUpdate(
        { name, category },
        { $inc: { quantity: -1 } }
      );
    }
    await checkAndAlertLowStock(ingredientsUsed);

    res.json({
      message: 'Order placed!',
      order
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
    module.exports = router;