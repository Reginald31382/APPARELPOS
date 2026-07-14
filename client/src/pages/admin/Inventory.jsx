import InventoryAdjustmentModal from "../../modules/inventory/components/InventoryAdjustmentModal";
import InventoryHistoryTable from "../../modules/inventory/components/InventoryHistoryTable";
import InventoryStats from "../../modules/inventory/components/InventoryStats";
import LowStockAlert from "../../modules/inventory/components/LowStockAlert";

import { useMemo, useState } from "react";
import useInventory from "../../modules/inventory/hooks/useInventory";

const Inventory = () => {
  const { data: products = [], isLoading } = useInventory();

  const [search, setSearch] = useState("");

  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);

  const inventory = useMemo(() => {
    return products.flatMap((product) =>
      product.variants.map((variant) => ({
        productId: product._id,
        image: product.images?.[0],
        name: product.name,
        sku: variant.sku,
        color: variant.color,
        size: variant.size,
        quantity: variant.quantity,
      })),
    );
  }, [products]);

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === "low") {
      return item.quantity > 0 && item.quantity <= 5;
    }

    if (filter === "out") {
      return item.quantity === 0;
    }

    return true;
  });

  if (isLoading) {
    return <p>Loading inventory...</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Inventory</h1>
      <InventoryStats />
      <InventoryStats />

      <LowStockAlert />
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search SKU or Product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 rounded-lg border p-3"
        />

        <button
          onClick={() => setFilter("all")}
          className={`rounded-lg border px-4 py-2 ${
            filter === "all" ? "bg-black text-white" : ""
          }`}
        >
          All
        </button>

        <button
          onClick={() => setFilter("low")}
          className={`rounded-lg border px-4 py-2 ${
            filter === "low" ? "bg-yellow-400" : ""
          }`}
        >
          Low Stock
        </button>

        <button
          onClick={() => setFilter("out")}
          className={`rounded-lg border px-4 py-2 ${
            filter === "out" ? "bg-red-500 text-white" : ""
          }`}
        >
          Out of Stock
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Product</th>
              <th className="p-4 text-left">SKU</th>
              <th className="p-4 text-left">Variant</th>
              <th className="p-4 text-center">Stock</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredInventory.map((item) => (
              <tr key={item.sku} className="border-t">
                <td className="p-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-14 w-14 rounded object-cover"
                  />
                </td>

                <td className="p-4 font-medium">{item.name}</td>

                <td className="p-4">{item.sku}</td>

                <td className="p-4">
                  {item.color} / {item.size}
                </td>

                <td className="p-4 text-center font-bold">{item.quantity}</td>

                <td className="p-4 text-center">
                  {item.quantity === 0 && (
                    <span className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-700">
                      Out
                    </span>
                  )}

                  {item.quantity > 0 && item.quantity <= 5 && (
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-700">
                      Low
                    </span>
                  )}

                  {item.quantity > 5 && (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                      In Stock
                    </span>
                  )}
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setModalOpen(true);
                    }}
                    className="rounded-lg bg-black px-3 py-2 text-white"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <InventoryAdjustmentModal
          item={selectedItem}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
      </div>
      <hr />
      <h1 className="text-3xl font-bold">Inventory History</h1>
      <hr />
      <InventoryHistoryTable />
    </div>
  );
};

export default Inventory;
