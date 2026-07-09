import Order from "../models/Order.js";

export const getReports = async (req, res) => {
  try {
    const { start, end } = req.query;

    const query = {};

    if (start && end) {
      query.createdAt = {
        $gte: new Date(start),
        $lte: new Date(`${end}T23:59:59.999Z`),
      };
    }

    const orders = await Order.find(query);

    const revenue = orders.reduce((sum, order) => sum + order.total, 0);

    const tax = orders.reduce((sum, order) => sum + order.tax, 0);

    const averageOrder = orders.length ? revenue / orders.length : 0;

    const paymentMethods = {
      cash: 0,
      stripe: 0,
    };

    const productMap = new Map();

    for (const order of orders) {
      if (order.paymentMethod === "Cash") {
        paymentMethods.cash += order.total;
      }

      if (order.paymentMethod === "Stripe") {
        paymentMethods.stripe += order.total;
      }

      for (const item of order.items) {
        const current = productMap.get(item.name) || 0;

        productMap.set(item.name, current + item.quantity);
      }
    }

    const topProducts = [...productMap.entries()]
      .map(([name, quantity]) => ({
        name,
        quantity,
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    res.json({
      summary: {
        revenue,
        orders: orders.length,
        tax,
        averageOrder,
      },
      paymentMethods,
      topProducts,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
