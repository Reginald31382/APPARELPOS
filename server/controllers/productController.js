import Product from "../models/Products.js";
import InventoryHistory from "../models/InventoryHistory.js";

export const getProducts = async (req, res) => {
  try {
    const { search = "", category, brand, featured, sort } = req.query;

    let query = {};

    // ONLY apply search if meaningful
    if (search && search.trim() !== "") {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { "variants.sku": { $regex: search, $options: "i" } },
      ];
    }

    if (category && category.trim() !== "") {
      query.category = category;
    }

    if (brand && brand.trim() !== "") {
      query.brand = brand;
    }

    if (featured !== undefined && featured !== "") {
      query.featured = featured === "true";
    }

    // console.log("FINAL QUERY:", JSON.stringify(query, null, 2));

    let sortQuery = {};

    switch (sort) {
      case "priceLow":
        sortQuery.price = 1;
        break;

      case "priceHigh":
        sortQuery.price = -1;
        break;

      case "name":
        sortQuery.name = 1;
        break;

      case "featured":
        sortQuery.featured = -1;
        break;

      default:
        sortQuery.createdAt = -1;
    }

    const products = await Product.find(query).sort(sortQuery);

    res.json(products);
  } catch (error) {
    console.log("PRODUCT API ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateInventory = async (req, res) => {
  try {
    const { sku, quantity, reason, notes } = req.body;

    const product = await Product.findOne({
      "variants.sku": sku,
    });

    if (!product) {
      return res.status(404).json({
        message: "Variant not found.",
      });
    }

    const variant = product.variants.find((v) => v.sku === sku);

    const previousQuantity = variant.quantity;

    variant.quantity = quantity;

    await product.save();

    await InventoryHistory.create({
      product: product._id,
      sku,
      productName: product.name,
      previousQuantity,
      newQuantity: quantity,
      adjustment: quantity - previousQuantity,
      reason,
      notes,
      performedBy: req.user._id,
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
