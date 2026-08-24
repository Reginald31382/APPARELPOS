import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SEO from "../../components/SEO";
import ProductGrid from "../../modules/product/ProductGrid";
// import ShopHeroBanner from "../../modules/shop/components/ShopHeroBanner";
import useProductStore from "../../store/product/useProductStore";
const Shop = () => {
  const [searchParams] = useSearchParams();

  const setCategory = useProductStore((state) => state.setCategory);
  const setGender = useProductStore((state) => state.setGender);

  useEffect(() => {
    setCategory(searchParams.get("category") || "");
    setGender(searchParams.get("gender") || "");
  }, [searchParams, setCategory, setGender]);

  return (
    <>
      <SEO
        title="Shop Urban Apparel & Streetwear"
        description="Shop J.Rome Studios urban apparel and streetwear, including graphic tees, hoodies, shirts, and fashion for men, women, and kids."
        path="/shop"
      />
      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* <ShopHeroBanner /> */}
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
            Shop Responsibly
          </p>
        </div>
        <ProductGrid
          emptyMessage={
            searchParams.get("gender")
              ? `${searchParams.get("gender")} coming soon.`
              : searchParams.get("category")
                ? `${searchParams.get("category")} coming soon.`
                : "No products found."
          }
        />
      </div>
    </>
  );
};

export default Shop;
