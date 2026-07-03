import useProductStore from "../../store/useProductStore";

const ProductCard = ({ product }) => {
  const openProduct = useProductStore((state) => state.openProduct);

  return (
    <div
      onClick={() => openProduct(product)}
      className="border rounded-lg p-3 cursor-pointer hover:shadow-md transition"
    >
      <img
        src={product.images?.[0]}
        className="h-40 w-full object-cover rounded"
      />

      <h2 className="mt-2 font-semibold">{product.name}</h2>

      <p className="text-sm text-gray-500">${product.price}</p>
    </div>
  );
};

export default ProductCard;
