import Order from "../models/Order.js";
import Product from "../models/Products.js";

const buildDateQuery = (start, end, range) => {
  const query = {};

  const today = new Date();

  switch (range) {
    case "today": {
      const startDate = new Date(today);
      startDate.setHours(0, 0, 0, 0);

      query.createdAt = {
        $gte: startDate,
      };

      break;
    }

    case "last7": {
      const startDate = new Date(today);
      startDate.setDate(startDate.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);

      query.createdAt = {
        $gte: startDate,
      };

      break;
    }

    case "last30": {
      const startDate = new Date(today);
      startDate.setDate(startDate.getDate() - 29);
      startDate.setHours(0, 0, 0, 0);

      query.createdAt = {
        $gte: startDate,
      };

      break;
    }

    case "month": {
      const startDate = new Date(today.getFullYear(), today.getMonth(), 1);

      query.createdAt = {
        $gte: startDate,
      };

      break;
    }

    case "lastMonth": {
      const startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);

      const endDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        0,
        23,
        59,
        59,
        999,
      );

      query.createdAt = {
        $gte: startDate,
        $lte: endDate,
      };

      break;
    }

    case "custom": {
      if (start && end) {
        query.createdAt = {
          $gte: new Date(start),
          $lte: new Date(`${end}T23:59:59.999Z`),
        };
      }

      break;
    }

    default:
      {
        const startDate = new Date(today);

        startDate.setHours(0, 0, 0, 0);

        query.createdAt = {
          $gte: startDate,
        };

        break;
      }
      break;
  }

  return query;
};

export const getSummary = async ({ start, end, range }) => {
  const query = buildDateQuery(start, end, range);
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

export const getSales = async ({ start, end, range }) => {
  const query = buildDateQuery(start, end, range);

  let groupFormat = "%Y-%m-%d";

  switch (range) {
    case "today":
      groupFormat = "%H:00";
      break;

    case "month":
    case "lastMonth":
      groupFormat = "%Y-%U";
      break;

    default:
      groupFormat = "%Y-%m-%d";
      break;
  }

  const sales = await Order.aggregate([
    {
      $match: query,
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: groupFormat,
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

  return sales.map((item) => ({
    ...item,
    revenue: Number(item.revenue.toFixed(2)),
  }));
};

export const getOrders = async ({ start, end, range }) => {
  const query = buildDateQuery(start, end, range);
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

export const getProducts = async ({ start, end, range }) => {
  const query = buildDateQuery(start, end, range);
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
