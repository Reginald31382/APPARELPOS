import { getShippingRates } from "../services/shippingService.js";

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
