import Order from "../models/Order.js";

/*
GET /api/orders
*/
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer")
      .sort({ createdAt: -1 });

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
    const order = await Order.findById(req.params.id).populate("customer");

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
    const order = await Order.create(req.body);

    res.status(201).json(order);
  } catch (error) {
    console.error("Create Order Error:");
    console.error(error);

    res.status(500).json({
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
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
