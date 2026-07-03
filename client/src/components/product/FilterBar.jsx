import useFilterStore from "../../store/useFilterStore";

const FilterBar = () => {
  const { setCategory, setBrand, resetFilters } = useFilterStore();

  return (
    <div className="flex gap-3 flex-wrap">
      <button onClick={() => setCategory("Hats")}>Hats</button>

      <button onClick={() => setCategory("Hoodies")}>Hoodies</button>

      <button onClick={() => setBrand("J.Rome")}>J.Rome</button>

      <button onClick={resetFilters}>Reset</button>
    </div>
  );
};

export default FilterBar;
