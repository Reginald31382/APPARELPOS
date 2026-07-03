import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import Product from "../models/Products.js";

import products from "../data/products.js";

dotenv.config();

await connectDB();

try {
  await Product.deleteMany();

  await Product.insertMany(products);

  console.log("✅ Products Seeded");

  mongoose.connection.close();
} catch (err) {
  console.log(err);

  mongoose.connection.close();
}
