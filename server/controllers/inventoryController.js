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
