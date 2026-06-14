const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  
    name: { type: String, required: true},

    category: {
        type: String,
         enum: ['base', 'sauce', 'cheese', 'veggie', 'meat'],
         required: true
        },

        quantity: { type: Number, default: 100},
        threshold: { type: Number , default: 20},

} , {timestamps : true});

module.exports = mongoose.model('Inventory', inventorySchema);
