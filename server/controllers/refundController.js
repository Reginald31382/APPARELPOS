import Order from "../models/Order.js";

import { restoreInventory } from "../services/inventoryService.js";

export const refundOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    if (order.status === "Refunded") {
      return res.status(400).json({
        message: "Order already refunded.",
      });
    }

    await restoreInventory(order.items);

    order.status = "Refunded";

    order.paymentStatus = "Refunded";

    order.refund = {
      amount: order.total,
      reason: req.body.reason || "Customer Return",
      refundedBy: req.user._id,
      refundedAt: new Date(),
    };

    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
