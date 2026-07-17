import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const reasons = [
  "Customer Return",
  "Damaged Item",
  "Wrong Item Sold",
  "Duplicate Transaction",
  "Other",
];

const RefundOrderModal = ({ order, open, onOpenChange, onRefund }) => {
  const [reason, setReason] = useState(reasons[0]);

  if (!order) return null;

  const handleRefund = () => {
    onRefund({
      orderId: order._id,
      reason,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Refund Order</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p>
            Are you sure you want to refund order{" "}
            <strong>{order.orderNumber}</strong>?
          </p>

          <div>
            <label className="mb-2 block font-medium">Refund Reason</label>

            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-lg border p-2"
            >
              {reasons.map((reason) => (
                <option key={reason}>{reason}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-lg border px-4 py-2"
            >
              Cancel
            </button>

            <button
              onClick={handleRefund}
              className="rounded-lg bg-red-600 px-4 py-2 text-white"
            >
              Process Refund
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RefundOrderModal;
