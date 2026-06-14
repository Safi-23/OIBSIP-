const mongoose = require("mongoose");
const { ref } = require("node:process");
const User = require("./User");
const { NONAME } = require("node:dns");

const orderSchema = new mongoose.Schema({

    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },

    base : {
        type: String,
        required: true
    },

    sauce : {
        type: String,
        required: true
    },
    
    cheese : {
        type: String,
        required: true
    },

    veggies : [String],
    
    status : {
        type: String,
        enum: ["Order Received" , "In Kitchen" , "Sent To Delivery"],
        default: "Order Received"
    },

    totalPrice : {
        type: Number,
        required: true,
    },

    paymentId: String,

} ,{timestamps : true});

const Order = mongoose.model("Order",orderSchema);
module.exports = Order;