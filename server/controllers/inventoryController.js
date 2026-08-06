import InventoryHistory from "../models/InventoryHistory.js";
import { reduceInventory } from "../services/inventoryService.js";

export const updateInventory = async (req, res) => {
  try {
    await reduceInventory(req.body.items);

    res.json({
      success: true,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

export const getInventoryHistory = async (req, res) => {
  try {
    const history = await InventoryHistory.find()
      .populate("performedBy", "firstName lastName")
      .sort({
        createdAt: -1,
      });

    res.json(history);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getInventoryHistoryByProduct = async (req, res) => {
  try {
    const history = await InventoryHistory.find({
      product: req.params.productId,
    })
      .populate("performedBy", "firstName lastName")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(history);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
