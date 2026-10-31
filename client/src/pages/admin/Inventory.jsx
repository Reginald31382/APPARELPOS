import { useMemo, useState, useEffect } from "react";
import {
  Search,
  Package,
  AlertTriangle,
  CircleX,
  Boxes,
  SlidersHorizontal,
  ArrowUpRight,
  History,
} from "lucide-react";

import InventoryAdjustmentModal from "../../modules/inventory/components/InventoryAdjustmentModal";
import InventoryHistoryTable from "../../modules/inventory/components/InventoryHistoryTable";
import InventoryStats from "../../modules/inventory/components/InventoryStats";
import LowStockAlert from "../../modules/inventory/components/LowStockAlert";

import useInventory from "../../modules/product/hooks/useInventory";

const filters = [
  { value: "all", label: "All Items" },
  { value: "low", label: "Low Stock" },
  { value: "out", label: "Out of Stock" },
];

const ITEMS_PER_PAGE = 10;

const Inventory = () => {
  const { data: products = [], isLoading } = useInventory();

  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const inventory = useMemo(() => {
    return products.flatMap((product) =>
      (product.variants || []).map((variant) => ({
        productId: product._id,
        image: product.images?.[0],
        name: product.name,
        sku: variant.sku || "",
        color: variant.color || "",
        size: variant.size || "",
        quantity: Number(variant.quantity || 0),
      })),
    );
  }, [products]);

  const filteredInventory = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return inventory.filter((item) => {
      const matchesSearch =
        item.name?.toLowerCase().includes(normalizedSearch) ||
        item.sku.toLowerCase().includes(normalizedSearch);

      if (!matchesSearch) return false;

      if (filter === "low") {
        return item.quantity > 0 && item.quantity <= 5;
      }

      if (filter === "out") {
        return item.quantity === 0;
      }

      return true;
    });
  }, [inventory, search, filter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  const stockCounts = useMemo(
    () => ({
      total: inventory.length,
      low: inventory.filter((item) => item.quantity > 0 && item.quantity <= 5)
        .length,
      out: inventory.filter((item) => item.quantity === 0).length,
    }),
    [inventory],
  );

  const totalPages = Math.ceil(filteredInventory.length / ITEMS_PER_PAGE);

  const paginatedInventory = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return filteredInventory.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredInventory, currentPage]);

  const openAdjustment = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) {
      return {
        label: "Out of Stock",
        className: "bg-red-50 text-red-700 ring-red-200",
        dot: "bg-red-500",
      };
    }

    if (quantity <= 5) {
      return {
        label: "Low Stock",
        className: "bg-amber-50 text-amber-700 ring-amber-200",
        dot: "bg-amber-500",
      };
    }

    return {
      label: "In Stock",
      className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      dot: "bg-emerald-500",
    };
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-black" />
          <p className="text-sm text-gray-500">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
            Store Management
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Inventory
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Monitor stock levels, manage product quantities, and review
            inventory activity.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 py-3 sm:self-center">
          <Package size={18} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            {stockCounts.total} Variants
          </span>
        </div>
      </div>

      {/* Inventory Statistics */}
      <section>
        <InventoryStats />
      </section>

      {/* Low Stock Alerts */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
          <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
            <AlertTriangle size={18} />
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">Inventory Alerts</h2>
            <p className="text-xs text-gray-500">
              Products that may need attention
            </p>
          </div>
        </div>

        <div className="p-5">
          <LowStockAlert onSelectItem={openAdjustment} />
        </div>
      </section>

      {/* Inventory Table */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Stock Overview
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              View and manage inventory by product variant.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-500">
            <Boxes size={15} />
            {filteredInventory.length} Results
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 border-b border-gray-100 bg-gray-50/60 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search product or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal size={16} className="mr-1 text-gray-400" />

            {filters.map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value)}
                className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                  filter === item.value
                    ? "bg-gray-900 text-white shadow-sm"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {item.label}

                {item.value === "low" && stockCounts.low > 0 && (
                  <span className="ml-2 opacity-70">{stockCounts.low}</span>
                )}

                {item.value === "out" && stockCounts.out > 0 && (
                  <span className="ml-2 opacity-70">{stockCounts.out}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Inventory Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                  Product
                </th>
                <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                  SKU
                </th>
                <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                  Variant
                </th>
                <th className="px-5 py-4 text-center text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                  Quantity
                </th>
                <th className="px-5 py-4 text-center text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                  Status
                </th>
                <th className="px-5 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {paginatedInventory.length > 0 ? (
                paginatedInventory.map((item, index) => {
                  const status = getStockStatus(item.quantity);

                  return (
                    <tr
                      key={item.sku || `${item.productId}-${index}`}
                      className="transition hover:bg-gray-50/80"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-gray-300">
                                <Package size={20} />
                              </div>
                            )}
                          </div>

                          <span className="max-w-[260px] text-sm font-medium text-gray-900">
                            {item.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-mono text-xs text-gray-500">
                          {item.sku || "—"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="text-sm text-gray-700">
                          {item.color || "—"}
                        </div>

                        {item.size && (
                          <div className="mt-1 text-xs text-gray-400">
                            Size: {item.size}
                          </div>
                        )}
                      </td>

                      <td className="px-5 py-4 text-center">
                        <span className="text-sm font-semibold tabular-nums text-gray-900">
                          {item.quantity}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold ring-1 ring-inset ${status.className}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                          />
                          {status.label}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => openAdjustment(item)}
                          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
                        >
                          Adjust
                          <ArrowUpRight size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                      {filter === "out" ? (
                        <CircleX size={22} />
                      ) : (
                        <Search size={22} />
                      )}
                    </div>

                    <p className="font-medium text-gray-800">
                      No inventory items found
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                      Try changing your search or stock filter.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col gap-4 border-t border-gray-100 bg-gray-50/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-500">
            Showing{" "}
            {filteredInventory.length === 0
              ? 0
              : (currentPage - 1) * ITEMS_PER_PAGE + 1}
            {" - "}
            {Math.min(
              currentPage * ITEMS_PER_PAGE,
              filteredInventory.length,
            )}{" "}
            of {filteredInventory.length} variants
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="px-3 text-xs text-gray-600">
              Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={currentPage >= totalPages}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>

        <InventoryAdjustmentModal
          item={selectedItem}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
      </section>

      {/* Inventory History */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gray-100 p-2 text-gray-600">
              <History size={19} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Inventory History
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Track inventory movements and adjustments across your store.
              </p>
            </div>
          </div>
        </div>

        <div className="p-5">
          <InventoryHistoryTable />
        </div>
      </section>
    </div>
  );
};

export default Inventory;
