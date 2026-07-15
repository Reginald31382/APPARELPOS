import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import useCartStore from "../../../store/cart/useCartStore";

const reasons = [
  "Employee Discount",
  "Military Discount",
  "Promotion",
  "Manager Approval",
  "Price Match",
  "Damaged Item",
  "Other",
];

const DiscountModal = ({ open, onOpenChange }) => {
  const subtotal = useCartStore((state) => state.subtotal);

  const TAX_RATE = 0.06;

  const setDiscount = useCartStore((state) => state.setDiscount);

  const [type, setType] = useState("Percentage");

  const [value, setValue] = useState("");

  const [reason, setReason] = useState(reasons[0]);

  const percentagePresets = [10, 15, 20, 25];

  const subtotalValue = subtotal();

  const discountAmount =
    type === "Percentage"
      ? subtotalValue * ((Number(value) || 0) / 100)
      : Math.min(Number(value) || 0, subtotalValue);

  const taxableSubtotal = subtotalValue - discountAmount;

  const previewTax = taxableSubtotal * TAX_RATE;

  const previewTotal = taxableSubtotal + previewTax;

  const handleApply = () => {
    setDiscount({
      type,
      value: Number(value),
      reason,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Apply Discount</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setType("Percentage")}
              className={`rounded-xl border p-5 transition ${
                type === "Percentage" ? "border-black bg-black text-white" : ""
              }`}
            >
              Percentage
            </button>

            <button
              onClick={() => setType("Amount")}
              className={`rounded-xl border p-5 transition ${
                type === "Amount" ? "border-black bg-black text-white" : ""
              }`}
            >
              Dollar Amount
            </button>
          </div>

          <div>
            {type === "Percentage" && (
              <div>
                <label className="mb-2 block font-medium">
                  Quick Discounts
                </label>

                <div className="mb-4 flex flex-wrap gap-2">
                  {percentagePresets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setValue(String(preset))}
                      className={`rounded-full border px-4 py-2 transition ${
                        Number(value) === preset
                          ? "border-black bg-black text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {preset}%
                    </button>
                  ))}
                </div>
              </div>
            )}
            <label className="mb-2 block font-medium">
              {type === "Percentage" ? "Custom Percentage" : "Dollar Amount"}
            </label>

            <input
              type="number"
              min="0"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full rounded-lg border p-3"
            />
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

          <div className="space-y-2 rounded-xl border bg-gradient-to-br from-gray-50 to-white p-5 shadow-sm">
            {" "}
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotalValue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>Discount</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${previewTax.toFixed(2)}</span>
            </div>
            <hr />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${previewTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-lg border px-4 py-2"
            >
              Cancel
            </button>

            <button
              disabled={
                !value || Number(value) <= 0 || discountAmount >= subtotalValue
              }
              onClick={handleApply}
              className="rounded-lg bg-black px-5 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Apply Discount
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DiscountModal;
