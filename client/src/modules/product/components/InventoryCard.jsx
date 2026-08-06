import { useState } from "react";
import { toast } from "react-hot-toast";
import { updateInventory } from "../services/inventoryService";

const InventoryCard = ({ variant, refetch }) => {
  const [quantity, setQuantity] = useState(variant.quantity);

  const [reason, setReason] = useState("Receiving Shipment");

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);

      await updateInventory({
        sku: variant.sku,
        quantity,
        reason,
        notes: "",
      });

      toast.success("Inventory updated.");

      refetch();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update inventory.",
      );
    } finally {
      setSaving(false);
    }
  };

  const status =
    quantity === 0
      ? {
          label: "Out of Stock",
          classes: "bg-red-100 text-red-700",
        }
      : quantity <= 5
        ? {
            label: "Low Stock",
            classes: "bg-yellow-100 text-yellow-700",
          }
        : {
            label: "In Stock",
            classes: "bg-green-100 text-green-700",
          };

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {variant.color} / {variant.size}
          </h3>

          <p className="mt-1 text-sm text-gray-500">SKU: {variant.sku}</p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${status.classes}`}
        >
          {status.label}
        </span>
      </div>

      <div className="mt-8">
        <p className="text-sm text-gray-500">Quantity</p>

        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={() => setQuantity((qty) => Math.max(0, qty - 1))}
            className="h-11 w-11 rounded-xl text-xl transition hover:bg-gray-100 cursor-pointer"
          >
            −
          </button>

          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="flex-1 rounded-xl border p-3 text-center text-xl font-bold "
          />

          <button
            onClick={() => setQuantity((qty) => qty + 1)}
            className="h-11 w-11 rounded-xl text-xl transition hover:bg-gray-100 cursor-pointer"
          >
            +
          </button>
        </div>
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-medium">Reason</label>

        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full rounded-xl border p-3"
        >
          <option>Receiving Shipment</option>
          <option>Manual Adjustment</option>
          <option>Damaged</option>
          <option>Lost</option>
          <option>Return</option>
        </select>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-6 w-full rounded-xl bg-black py-3 font-semibold text-white transition hover:bg-neutral-800 disabled:bg-gray-400"
      >
        {saving ? "Saving..." : "Save Adjustment"}
      </button>
    </div>
  );
};

export default InventoryCard;
