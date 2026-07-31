import Order from "../models/Order.js";
import { sendReceiptEmail } from "../services/email/sendReceiptEmail.js";
import { reduceInventory } from "../services/inventoryService.js";
import { emitOrderUpdated } from "../services/socketService.js";

const generateOrderNumber = () => {
  return `JR-${Date.now()}`;
};

/*
GET /api/orders
*/
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/*
GET /api/orders/:id
*/
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/*
POST /api/orders
*/
export const createOrder = async (req, res) => {
  try {
    console.log("Incoming Order:");
    console.dir(req.body, { depth: null });
    // Only Admins may apply discounts
    const discount = Number(req.body.discount || 0);

    if (discount > 0 && req.user?.role !== "Admin") {
      return res.status(403).json({
        message: "Only administrators can apply discounts.",
      });
    }
    const order = await Order.create({
      ...req.body,
      orderNumber: generateOrderNumber(),
    });

    // Update inventory
    await reduceInventory(order.items);

    // Send receipt email
    await sendReceiptEmail(order);

    res.status(201).json(order);
  } catch (error) {
    console.error("Create Order Error:");
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

/*
PUT /api/orders/:id
*/
export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/*
PATCH /api/orders/:id/status
*/
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Refunded",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status.",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    order.status = status;

    await order.save();
    emitOrderUpdated(order);

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/*
DELETE /api/orders/:id
*/
export const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);

    res.json({
      message: "Order deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getSuccessOrder = async (req, res) => {
  try {
    const { sessionId } = req.params;
    console.log("Looking for session:", sessionId);
    const order = await Order.findOne({
      stripeCheckoutSessionId: sessionId,
    });
    console.log("Order found:", order);
    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    res.json(order);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to retrieve order.",
    });
  }
};
