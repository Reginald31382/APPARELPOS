import Order from "../models/Order.js";
import Product from "../models/Products.js";

export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const ordersToday = await Order.find({
      createdAt: {
        $gte: today,
      },
    });

    const todaySales = ordersToday.reduce(
      (total, order) => total + order.total,
      0,
    );

    const itemsSold = ordersToday.reduce(
      (total, order) =>
        total + order.items.reduce((sum, item) => sum + item.quantity, 0),
      0,
    );

    const lowInventoryProducts = await Product.find({
      "variants.quantity": { $lte: 5 },
    })
      .select("name variants")
      .limit(5);

    const lowInventory = lowInventoryProducts.length;

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

    const last7Days = [];

    for (let i = 6; i >= 0; i--) {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      start.setDate(start.getDate() - i);

      const end = new Date(start);
      end.setDate(end.getDate() + 1);

      const orders = await Order.find({
        createdAt: {
          $gte: start,
          $lt: end,
        },
      });

      last7Days.push({
        day: start.toLocaleDateString("en-US", {
          weekday: "short",
        }),
        sales: orders.reduce((sum, order) => sum + order.total, 0),
      });
    }

    res.json({
      todaySales,
      ordersToday: ordersToday.length,
      itemsSold,
      lowInventory,
      lowInventoryProducts,
      recentOrders,
      last7Days,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
