import { Schema, model } from "mongoose";
import shortid from "shortid"; // or uuid

const orderSchema = new Schema({
  orderId: { type: String, default: shortid.generate },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  sellers: [
    {
      _id: false, // Disable automatic ID generation for items
      seller: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
      totalPrice: { type: Number, default: 0 }, // Removed `required: true` to calculate automatically
      items: [
        {
          _id: false, // Disable automatic ID generation for items
          product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          quantity: { type: Number, required: true, default: 1 },
          status: { type: String, default: "Pending" },
          price: { type: Number, required: true },
        },
      ],
    },
  ],
  paymentMethod: { type: String, enum: ["COD", "Credit Card"], required: true },
  orderTotalPrice: { type: Number, default: 0 }, // Overall order total calculated automatically
  transactionId: { type: String }, // For online payments
  shippingCost: { type: Number, default: 0 },
  notes: { type: String },
  orderStatus: { type: String, default: "Pending" },
  paymentStatus: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deliveredAt: { type: Date },
});

orderSchema.set("timestamps", true);

// Middleware to calculate total prices
orderSchema.pre("save", function (next) {
  let totalOrderPrice = 0;

  this.sellers.forEach((seller) => {
    let sellerTotalPrice = 0;
    seller.items.forEach((item) => {
      sellerTotalPrice += item.price * item.quantity;
    });
    seller.totalPrice = sellerTotalPrice; // Update each seller's totalPrice
    totalOrderPrice += sellerTotalPrice;
  });
  this.orderTotalPrice = totalOrderPrice + this.shippingCost; // Update overall order total price

  next();
});

const OrderModel = model("Order", orderSchema);

export default OrderModel;
