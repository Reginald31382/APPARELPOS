import Order from "../models/Order.js";

const buildDateQuery = (start, end) => {
  const query = {};

  if (start && end) {
    query.createdAt = {
      $gte: new Date(start),
      $lte: new Date(`${end}T23:59:59.999Z`),
    };
  }

  return query;
};

export const getReportSummary = async (req, res) => {
  try {
    const { start, end } = req.query;

    const query = buildDateQuery(start, end);

    const orders = await Order.find(query);

    const revenue = orders.reduce((sum, order) => sum + order.total, 0);

    const tax = orders.reduce((sum, order) => sum + order.tax, 0);

    const averageOrder = orders.length ? revenue / orders.length : 0;

    res.json({
      revenue,
      orders: orders.length,
      tax,
      averageOrder,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const getSalesReport = async (req, res) => {
  try {
    const { start, end } = req.query;

    const query = buildDateQuery(start, end);

    const sales = await Order.aggregate([
      {
        $match: query,
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          revenue: {
            $sum: "$total",
          },
          orders: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    res.json(sales);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const getOrdersReport = async (req, res) => {
  res.json({
    message: "Orders report coming soon",
  });
};

export const getProductsReport = async (req, res) => {
  res.json({
    message: "Products report coming soon",
  });
};

export const getInventoryReport = async (req, res) => {
  res.json({
    message: "Inventory report coming soon",
  });
};
