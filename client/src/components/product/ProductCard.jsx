import useCartStore from "../../store/useCartStore";

const ProductCard = ({ product }) => {
  const addToCart = useCartStore((state) => state.addToCart);

  const firstVariant = product.variants?.[0];

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow transition hover:shadow-lg">
      <img
        src={product.images?.[0]}
        alt={product.name}
        className="h-72 w-full object-cover"
      />

      <div className="space-y-2 p-4">
        <h3 className="text-lg font-bold">{product.name}</h3>

        <p className="text-sm text-gray-500">{product.brand}</p>

        <p className="text-xl font-bold text-blue-600">${product.price}</p>

        <button
          onClick={() => addToCart(product, firstVariant)}
          className="w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700"
        >
          Add To Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
