import express from "express";
import {
  getAllOrders,
  getOrdersBySellerId,
  createOrder,
  getOrdersByUserId,
  getRecentOrders,
  getRecentOrdersBySellerId,
  fetchYearlyOrdersStatistics,
  fetchYearlyOrdersStatisticsBySellerId,
} from "../controllers/order.controller.js";

const orderRouter = express.Router();
// Route to create an order
orderRouter.post("/orders", createOrder);

// Route to get all orders
orderRouter.get("/orders", getAllOrders);

// Route to get orders by seller ID
orderRouter.get("/orders/seller/:sellerId", getOrdersBySellerId);

// Route to get orders by user ID
orderRouter.get("/orders/user/:userId", getOrdersByUserId);

// Route to get recent orders
orderRouter.get("/orders/recent", getRecentOrders);

// Route to get recent orders by seller ID
orderRouter.get("/orders/recent/seller/:sellerId", getRecentOrdersBySellerId);

// Route to get orders that placed in current month
orderRouter.get("/orders/current-year-statistics", fetchYearlyOrdersStatistics);
orderRouter.get(
  "/orders/seller/current-year-statistics/:sellerId",
  fetchYearlyOrdersStatisticsBySellerId
);
export default orderRouter;
