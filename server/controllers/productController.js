import Product from "../models/Products.js";

export const getProducts = async (req, res) => {
  try {
    const { search = "", category, brand, featured } = req.query;

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

    console.log("FINAL QUERY:", JSON.stringify(query, null, 2));

    const products = await Product.find(query);

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
