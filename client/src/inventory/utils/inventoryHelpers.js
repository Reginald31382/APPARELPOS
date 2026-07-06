export const getTotalInventory = (variants = []) =>
  variants.reduce((total, variant) => total + variant.quantity, 0);

export const isOutOfStock = (variants = []) =>
  getTotalInventory(variants) === 0;

export const isLowStock = (variants = []) => getTotalInventory(variants) <= 5;
