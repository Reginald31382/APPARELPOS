import Order from "../models/Order.js";
import asyncHandler from "../utils/asyncHandler.js";
import { purchaseShippingLabel } from "../services/shipping/purchaseShippingLabel.js";
import { getShippingRates } from "../services/shippingService.js";
import { formatShippingStatus } from "../utils/shippingStatus.js";
import { emitOrderUpdated } from "../services/socketService.js";

/*
POST /api/shipping/rates
*/
export const calculateShippingRates = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items?.length) {
      return res.status(400).json({
        message: "No items provided.",
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        message: "Shipping address is required.",
      });
    }

    const rates = await getShippingRates({
      items,
      shippingAddress,
    });

    res.json(rates);
  } catch (error) {
    console.error("Shipping Error:", error);

    res.status(500).json({
      message: "Unable to calculate shipping.",
    });
  }
};

// export const purchaseLabel = asyncHandler(async (req, res) => {
//   const { orderId } = req.params;

//   const order = await purchaseShippingLabel(orderId);

//   res.json(order);
// });

export const purchaseLabel = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  try {
    // console.log("📦 Purchasing label for order:", orderId);

    const order = await purchaseShippingLabel(orderId);

    // console.log("✅ Label purchased successfully");

    res.json(order);
  } catch (error) {
    console.error("❌ Purchase Label Error");
    console.error(error);

    if (error.response?.data) {
      console.error("API Response:", error.response.data);
    }

    res.status(500).json({
      message: error.message,
    });
  }
});

export const trackingWebhook = asyncHandler(async (req, res) => {
  // console.log("📦 Shippo Webhook Received");
  console.dir(req.body, { depth: null });

  const event = req.body;

  const trackingNumber =
    event.data?.tracking_number || event.data?.object?.tracking_number;

  if (!trackingNumber) {
    return res.sendStatus(200);
  }

  const order = await Order.findOne({
    "shipping.trackingNumber": trackingNumber,
  });

  if (!order) {
    // console.log("❌ No order found:", trackingNumber);
    return res.sendStatus(200);
  }

  const status =
    event.data?.tracking_status?.status ||
    event.data?.tracking_status ||
    event.data?.object?.tracking_status?.status;

  if (status) {
    order.shipping.status = formatShippingStatus(status);

    switch (order.shipping.status) {
      case "In Transit":
        order.status = "Shipped";
        break;

      case "Out For Delivery":
        order.status = "Shipped";
        break;

      case "Delivered":
        order.status = "Delivered";
        order.shipping.deliveredAt = new Date();
        break;
    }
  }

  await order.save();
  emitOrderUpdated(order);

  console.log(`✅ ${order.orderNumber} updated to ${order.shipping.status}`);

  res.sendStatus(200);
});
