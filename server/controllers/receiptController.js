import Receipt from "../models/Receipt.js";

export const getReceipts = async (req, res) => {
  try {
    const receipts = await Receipt.find()
      .populate("order")
      .sort({ createdAt: -1 });

    res.json(receipts);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id).populate("order");

    if (!receipt) {
      return res.status(404).json({
        message: "Receipt not found",
      });
    }

    res.json(receipt);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
