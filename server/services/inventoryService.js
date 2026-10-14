import Product from "../models/Products.js";

/*
|--------------------------------------------------------------------------
| Reduce Inventory
|--------------------------------------------------------------------------
*/
export const reduceInventory = async (items, session = null) => {
  for (const item of items) {
    const productQuery = Product.findById(item.productId);

    const product = session
      ? await productQuery.session(session)
      : await productQuery;

    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }

    // Supplier-fulfilled products do not use local warehouse inventory.
    const fulfillmentType = product.fulfillmentType || "InHouse";

    if (fulfillmentType !== "InHouse") {
      continue;
    }

    const variant = product.variants.find((v) => v.sku === item.sku);

    if (!variant) {
      throw new Error(`Variant not found: ${item.sku}`);
    }

    if (variant.quantity < item.quantity) {
      throw new Error(`${product.name} does not have enough inventory.`);
    }

    variant.quantity -= item.quantity;

    await product.save(session ? { session } : {});
  }
};

/*
|--------------------------------------------------------------------------
| Restore Inventory
|--------------------------------------------------------------------------
*/
export const restoreInventory = async (items, session = null) => {
  for (const item of items) {
    const productQuery = Product.findById(item.productId);

    const product = session
      ? await productQuery.session(session)
      : await productQuery;

    if (!product) continue;

    // Only restore stock that belongs to the local warehouse.
    const fulfillmentType = product.fulfillmentType || "InHouse";

    if (fulfillmentType !== "InHouse") {
      continue;
    }

    const variant = product.variants.find((v) => v.sku === item.sku);

    if (!variant) continue;

    variant.quantity += item.quantity;

    await product.save(session ? { session } : {});
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

  const fulfillmentType = product.fulfillmentType || "InHouse";

  if (fulfillmentType !== "InHouse") {
    throw new Error(
      "Local inventory adjustments are only allowed for InHouse products.",
    );
  }

  const variant = product.variants.find((v) => v.sku === sku);

  if (!variant) {
    throw new Error("Variant not found.");
  }

  if (!Number.isInteger(quantity) || quantity < 0) {
    throw new Error("Inventory quantity must be a non-negative integer.");
  }

  variant.quantity = quantity;

  await product.save();

  return product;
};
