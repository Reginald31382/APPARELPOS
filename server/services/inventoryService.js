import Product from "../models/Products.js";

/*
|--------------------------------------------------------------------------
| Reduce Inventory
|--------------------------------------------------------------------------
*/
export const reduceInventory = async (items, session = null) => {
  for (const item of items) {
    const product = await Product.findById(item.productId).session(session);

    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }

    const variant = product.variants.find((v) => v.sku === item.sku);

    if (!variant) {
      throw new Error(`Variant not found: ${item.sku}`);
    }

    if (variant.quantity < item.quantity) {
      throw new Error(`${product.name} does not have enough inventory.`);
    }

    variant.quantity -= item.quantity;

    await product.save({ session });
  }
};

/*
|--------------------------------------------------------------------------
| Restore Inventory
|--------------------------------------------------------------------------
*/
export const restoreInventory = async (items, session = null) => {
  for (const item of items) {
    const product = await Product.findById(item.productId).session(session);

    if (!product) continue;

    const variant = product.variants.find((v) => v.sku === item.sku);

    if (!variant) continue;

    variant.quantity += item.quantity;

    await product.save({ session });
  }
};

/*
|--------------------------------------------------------------------------
| Manual Inventory Adjustment
|--------------------------------------------------------------------------
*/
export const adjustInventory = async (sku, quantity) => {
  const product = await Product.findOne({
    "variants.sku": sku,
  });

  if (!product) {
    throw new Error("Variant not found.");
  }

  const variant = product.variants.find((v) => v.sku === sku);

  if (!variant) {
    throw new Error("Variant not found.");
  }

  variant.quantity = quantity;

  await product.save();

  return product;
};
