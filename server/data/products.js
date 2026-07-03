const colors = ["Black", "White", "Red", "Blue", "Green", "Cream"];

const sizes = ["S", "M", "L", "XL"];

const categories = ["T-Shirts", "Hoodies", "Pants", "Shorts", "Hats"];

const products = [];

for (let i = 1; i <= 50; i++) {
  const variants = [];

  colors.slice(0, 2).forEach((color) => {
    sizes.forEach((size) => {
      variants.push({
        color,
        size,
        quantity: Math.floor(Math.random() * 20) + 1,
        sku: `JR-${i}-${color}-${size}`,
        barcode: `${100000000 + i}${size}`,
      });
    });
  });

  products.push({
    name: `J.Rome Product ${i}`,
    description: "Premium Urban Apparel",
    brand: "J.Rome",
    category: categories[Math.floor(Math.random() * categories.length)],
    gender: "Unisex",
    price: Math.floor(Math.random() * 60) + 20,
    salePrice: 0,
    cost: 10,
    images: [`https://picsum.photos/500/700?random=${i}`],
    featured: i < 8,
    variants,
  });
}

export default products;
