import api from "../../../api/axios";

export const getInventory = async () => {
  const { data } = await api.get("/products");

  return data;
};
export const reduceInventory = async (items) => {
  for (const item of items) {
    const product = await Product.findById(item.productId);

    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }

    const variant = product.variants.find((v) => v.sku === item.sku);

    if (!variant) {
      throw new Error(`Variant not found: ${item.sku}`);
    }

    if (variant.quantity < item.quantity) {
      throw new Error(`${product.name} does not have enough inventory`);
    }

    variant.quantity -= item.quantity;

    await product.save();
  }
};
