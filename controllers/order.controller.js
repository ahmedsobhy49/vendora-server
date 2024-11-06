import moment from "moment";
import orderModel from "../models/order.model.js";
import mongoose from "mongoose";
// Create a new order
const createOrder = async (req, res) => {
  try {
    const { user, sellers, paymentMethod } = req.body;
    // Validation: Ensure required fields are provided
    if (!user || !sellers || !Array.isArray(sellers) || !sellers.length) {
      return res
        .status(400)
        .json({ error: "User and sellers data are required" });
    }

    // Validate seller data
    for (const seller of sellers) {
      // Check if seller object is valid
      if (
        !seller ||
        !seller.seller ||
        !Array.isArray(seller.items) ||
        !seller.items.length
      ) {
        return res
          .status(400)
          .json({ error: "Each seller must have an ID and at least one item" });
      }

      // Validate each item within the seller
      for (const item of seller.items) {
        if (!item.product || !item.quantity) {
          return res.status(400).json({
            error: "Each item must have productId, quantity, and price",
          });
        }
      }
    }

    // Create a new order instance
    const newOrder = new orderModel({
      user,
      sellers,
      paymentStatus: "Pending",
      paymentMethod,
    });

    // Save the order to the database (pre-save middleware calculates prices)
    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find()
      .populate("user", "firstName lastName email phone") // Populate user details (example fields)
      .populate(
        "sellers.seller",
        "firstName lastName email businessInfo.companyName"
      ) // Populate seller details
      .populate("sellers.items.product", "name price productImages"); // Populate product details

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getOrdersBySellerId = async (req, res) => {
  try {
    const { sellerId } = req.params;

    // Fetch orders containing the specified sellerId in the sellers array
    const orders = await orderModel
      .find({ "sellers.seller": sellerId })
      .populate("user", "firstName lastName email phone") // Populate user details
      .populate("sellers.seller") // Populate seller details
      .populate("sellers.items.product", "name price productImages"); // Populate product details

    // Filter sellers array to include only the seller with the matching sellerId
    const filteredOrders = orders.map((order) => {
      const filteredSellers = order.sellers.filter(
        (seller) => String(seller.seller._id) === sellerId
      );
      return { ...order._doc, sellers: filteredSellers }; // Modify the order's sellers array
    });

    if (filteredOrders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this seller" });
    }

    res.status(200).json(filteredOrders);
  } catch (error) {
    console.error("Error fetching orders for seller:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get orders by user ID
const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId from request parameters

    const orders = await orderModel
      .find({ user: userId }) // Find orders for the specific user
      .populate("user", "name email") // Populate user details
      .populate("sellers.sellerId", "name") // Populate seller details
      .populate("sellers.items.productId", "name price"); // Populate product details

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json(orders); // Respond with the found orders
  } catch (error) {
    console.error("Error fetching orders for user:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get recent orders (orders created within the last 48 hours)
async function getRecentOrders(req, res) {
  console.log("Connecting to database...");
  const startOfYesterday = moment().subtract(1, "days").startOf("day").toDate();
  const endOfToday = moment().endOf("day").toDate();

  try {
    console.log("Fetching recent orders...");
    const orders = await orderModel
      .find({
        createdAt: { $gte: startOfYesterday, $lte: endOfToday },
      })
      .populate("user", "firstName lastName email phone") // Populate user details (example fields)
      .populate(
        "sellers.seller",
        "firstName lastName email businessInfo.companyName"
      ) // Populate seller details
      .populate("sellers.items.product", "name price productImages"); // Populate product details;
    console.log("Orders fetched:", orders);
    res.status(200).json(orders); // Respond with the found orders
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    res.status(500).json({ error: "Server error" });
  }
}

// function to return the statistics of orders placed in current year
const fetchYearlyOrdersStatistics = async (req, res) => {
  try {
    const startOfYear = moment().startOf("year").toDate();
    const endOfYear = moment().endOf("year").toDate();
    const currentYear = moment().format("YYYY");
    const currentMonthIndex = moment().month(); // Get current month index (0 for January, 11 for December)

    // Aggregation pipeline to get monthly order counts and total sales
    const result = await orderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfYear, $lte: endOfYear },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalOrders: { $sum: 1 },
          totalSales: { $sum: "$orderTotalPrice" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Array of month names
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Prepare monthly statistics for the current year
    const monthlyStats = Array(12)
      .fill(null)
      .map((_, index) => ({
        monthName: monthNames[index],
        totalOrders: 0,
        totalSales: 0,
        current: index === currentMonthIndex, // Set `current: true` for the current month
      }));

    // Populate the monthly stats with data from the aggregation result
    result.forEach((item) => {
      const monthIndex = item._id.month - 1; // Convert MongoDB month to JavaScript 0-indexed month
      monthlyStats[monthIndex] = {
        monthName: monthNames[monthIndex],
        totalOrders: item.totalOrders,
        totalSales: item.totalSales,
        current: monthIndex === currentMonthIndex, // Ensure `current: true` remains for the current month
      };
    });

    res.status(200).json({
      message: `Monthly statistics for the year ${currentYear}`,
      monthlyStats,
      year: currentYear,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while retrieving the order statistics.",
      error: error.message,
    });
  }
};

// function to get the recent orders by seller id
const getRecentOrdersBySellerId = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const startOfYesterday = moment()
      .subtract(1, "days")
      .startOf("day")
      .toDate();
    const endOfToday = moment().endOf("day").toDate();

    // Fetch recent orders containing the specified sellerId in the sellers array
    const orders = await orderModel
      .find({
        "sellers.seller": sellerId,
        createdAt: { $gte: startOfYesterday, $lte: endOfToday },
      })
      .populate("user", "firstName lastName email phone") // Populate user details
      .populate(
        "sellers.seller",
        "firstName lastName email businessInfo.companyName"
      ) // Populate seller details
      .populate("sellers.items.product", "name price productImages"); // Populate product details

    // Filter the sellers array to include only the seller with the matching sellerId
    const filteredOrders = orders.map((order) => {
      const filteredSellers = order.sellers.filter(
        (seller) => String(seller.seller._id) === sellerId
      );
      return { ...order._doc, sellers: filteredSellers }; // Modify the order's sellers array
    });

    if (filteredOrders.length === 0) {
      return res
        .status(404)
        .json({ message: "No recent orders found for this seller" });
    }

    res.status(200).json(filteredOrders);
  } catch (error) {
    console.error("Error fetching recent orders for seller:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// function to get yearly orders statistics by seller id
const fetchYearlyOrdersStatisticsBySellerId = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const startOfYear = moment().startOf("year").toDate();
    const endOfYear = moment().endOf("year").toDate();
    const currentYear = moment().format("YYYY");
    const currentMonthIndex = moment().month();

    const result = await orderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfYear, $lte: endOfYear },
          "sellers.seller": new mongoose.Types.ObjectId(sellerId),
        },
      },
      { $unwind: "$sellers" },
      {
        $match: { "sellers.seller": new mongoose.Types.ObjectId(sellerId) },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalOrders: { $sum: 1 },
          totalSales: { $sum: "$sellers.totalPrice" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    console.log("Aggregation result:", result);

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const monthlyStats = Array(12)
      .fill(null)
      .map((_, index) => ({
        monthName: monthNames[index],
        totalOrders: 0,
        totalSales: 0,
        current: index === currentMonthIndex,
      }));

    result.forEach((item) => {
      const monthIndex = item._id.month - 1;
      monthlyStats[monthIndex] = {
        monthName: monthNames[monthIndex],
        totalOrders: item.totalOrders,
        totalSales: item.totalSales,
        current: monthIndex === currentMonthIndex,
      };
    });

    res.status(200).json({
      message: `Monthly statistics for seller in year ${currentYear}`,
      monthlyStats,
      year: currentYear,
    });
  } catch (error) {
    console.error("Error fetching yearly statistics by seller ID:", error);
    res.status(500).json({
      message:
        "An error occurred while retrieving the seller's order statistics.",
      error: error.message,
    });
  }
};

export {
  createOrder,
  getAllOrders,
  getOrdersBySellerId,
  getOrdersByUserId,
  getRecentOrders,
  getRecentOrdersBySellerId,
  fetchYearlyOrdersStatistics,
  fetchYearlyOrdersStatisticsBySellerId,
};
