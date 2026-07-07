const categories = ["All", "Men", "Women", "Kids", "Accessories", "Sale"];

const CategoryTabs = () => {
  return (
    <div className="flex gap-2 overflow-x-auto">
      {categories.map((category) => (
        <button
          key={category}
          className="rounded-full border px-4 py-2 whitespace-nowrap hover:bg-black hover:text-white"
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
