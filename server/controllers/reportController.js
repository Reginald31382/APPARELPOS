import * as reportService from "../services/reportService.js";
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
    const data = await reportService.getSummary(req.query);

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const getSalesReport = async (req, res) => {
  try {
    const data = await reportService.getSales(req.query);

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const getOrdersReport = async (req, res) => {
  try {
    const data = await reportService.getOrders(req.query);

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProductsReport = async (req, res) => {
  try {
    const data = await reportService.getProducts(req.query);

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const getInventoryReport = async (req, res) => {
  try {
    const data = await reportService.getInventory(req.query);

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
