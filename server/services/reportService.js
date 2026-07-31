import Order from "../models/Order.js";
import Product from "../models/Products.js";

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

export const getSummary = async ({ start, end }) => {
  const query = buildDateQuery(start, end);

  const orders = await Order.find(query);

  const revenue = orders.reduce((sum, order) => sum + order.total, 0);

  const tax = orders.reduce((sum, order) => sum + order.tax, 0);

  const averageOrder = orders.length > 0 ? revenue / orders.length : 0;

  return {
    revenue,
    orders: orders.length,
    tax,
    averageOrder,
  };
};

export const getSales = async ({ start, end }) => {
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

  return sales.map((day) => ({
    ...day,
    revenue: Number(day.revenue.toFixed(2)),
  }));
};

export const getOrders = async ({ start, end }) => {
  const query = buildDateQuery(start, end);

  const orders = await Order.find(query).sort({ createdAt: -1 }).limit(10);

  const statuses = await Order.aggregate([
    {
      $match: query,
    },
    {
      $group: {
        _id: "$status",
        count: {
          $sum: 1,
        },
      },
    },
  ]);

  const paymentStatuses = await Order.aggregate([
    {
      $match: query,
    },
    {
      $group: {
        _id: "$paymentStatus",
        count: {
          $sum: 1,
        },
      },
    },
  ]);

  const paymentMethods = await Order.aggregate([
    {
      $match: query,
    },
    {
      $group: {
        _id: "$paymentMethod",
        revenue: {
          $sum: "$total",
        },
      },
    },
  ]);

  return {
    recentOrders: orders,
    statuses,
    paymentStatuses,
    paymentMethods,
  };
};

export const getProducts = async ({ start, end }) => {
  const query = buildDateQuery(start, end);

  const products = await Order.aggregate([
    {
      $match: query,
    },
    {
      $unwind: "$items",
    },
    {
      $group: {
        _id: "$items.name",
        quantity: {
          $sum: "$items.quantity",
        },
        revenue: {
          $sum: {
            $multiply: ["$items.quantity", "$items.unitPrice"],
          },
        },
      },
    },
    {
      $sort: {
        quantity: -1,
      },
    },
    {
      $limit: 10,
    },
  ]);

  return {
    topProducts: products,
  };
};

export const getInventory = async () => {
  const lowInventory = await Product.find({
    "variants.quantity": { $lte: 5 },
  }).select("name variants");

  return {
    lowInventory,
  };
};
