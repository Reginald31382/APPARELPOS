import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import useUpdateInventory from "@/modules/product/hooks/useUpdateInventory";

const reasons = [
  "Receiving Shipment",
  "Customer Return",
  "Damaged",
  "Manual Adjustment",
  "Inventory Count",
];

const InventoryAdjustmentModal = ({ item, open, onOpenChange }) => {
  const { mutate, isPending } = useUpdateInventory();

  const [quantity, setQuantity] = useState(0);

  const [reason, setReason] = useState(reasons[0]);

  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (item) {
      setQuantity(item.quantity);
      setReason(reasons[0]);
      setNotes("");
    }
  }, [item]);

  if (!item) return null;

  const adjustment = quantity - item.quantity;

  const handleSave = () => {
    mutate(
      {
        sku: item.sku,
        quantity,
        reason,
        notes,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Inventory Adjustment</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex gap-4">
            <img
              src={item.image}
              alt={item.name}
              className="h-24 w-24 rounded-lg object-cover"
            />

            <div>
              <h2 className="text-lg font-bold">{item.name}</h2>

              <p className="text-gray-500">
                {item.color} / {item.size}
              </p>

              <p className="text-sm text-gray-400">{item.sku}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block font-medium">Current Stock</label>

              <input
                disabled
                value={item.quantity}
                className="w-full rounded-lg border bg-gray-100 p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">New Stock</label>

              <input
                type="number"
                value={quantity}
                min={0}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full rounded-lg border p-3"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-medium">Adjustment</label>

            <div
              className={`rounded-lg border p-3 text-lg font-bold ${
                adjustment > 0
                  ? "text-green-600"
                  : adjustment < 0
                    ? "text-red-600"
                    : ""
              }`}
            >
              {adjustment > 0 ? "+" : ""}
              {adjustment}
            </div>
          </div>

          <div>
            <label className="mb-2 block font-medium">Reason</label>

            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-lg border p-3"
            >
              {reasons.map((reason) => (
                <option key={reason}>{reason}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium">Notes</label>

            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-lg border px-4 py-2"
            >
              Cancel
            </button>

            <button
              disabled={isPending}
              onClick={handleSave}
              className="rounded-lg bg-black px-5 py-2 text-white"
            >
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InventoryAdjustmentModal;
