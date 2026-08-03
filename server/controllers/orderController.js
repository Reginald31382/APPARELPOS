import Order from "../models/Order.js";
import asyncHandler from "../utils/asyncHandler.js";
// import { completeOrder } from "../services/orderService.js";
import { emitOrderUpdated } from "../services/socketService.js";
import { getStripe } from "../services/stripeService.js";
import { createStripeOrder } from "../services/orderService.js";

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
  // console.log(req.body);
  try {
    const discount = Number(req.body.discount || 0);

    if (discount > 0 && req.user?.role !== "Admin") {
      return res.status(403).json({
        message: "Only administrators can apply discounts.",
      });
    }

    const order = await completeOrder({
      ...req.body,

      paymentMethod: req.body.paymentMethod || "Cash",

      paymentStatus: "Paid",

      status: "Processing",
    });

    res.status(201).json(order);
  } catch (error) {
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

    // console.log("Looking for session:", sessionId);

    // First look in MongoDB
    let order = await Order.findOne({
      stripeCheckoutSessionId: sessionId,
    });

    if (order) {
      // console.log("✅ Order found in MongoDB:", order.orderNumber);
      return res.json(order);
    }

    // console.log("⚠️ Order not found. Checking Stripe...");

    const stripe = getStripe();

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(404).json({
        message: "Payment has not completed.",
      });
    }

    // Double-check in case another request/webhook created it
    order = await Order.findOne({
      stripeCheckoutSessionId: session.id,
    });

    if (!order) {
      // console.log("🛠 Creating missing order from Stripe session...");

      order = await createStripeOrder(session);

      // console.log("✅ Recovery successful:", order.orderNumber);
    }

    res.json(order);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to retrieve order.",
    });
  }
};

export const getOrderByNumber = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    orderNumber: req.params.orderNumber,
  });

  if (!order) {
    return res.status(404).json({
      message: "Order not found",
    });
  }

  res.json(order);
});

export const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysOrders = await Order.find({
      createdAt: { $gte: today },
    });

    const revenueToday = todaysOrders.reduce(
      (sum, order) => sum + order.total,
      0,
    );

    res.json({
      totalOrders,
      todaysOrders: todaysOrders.length,
      revenueToday,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
