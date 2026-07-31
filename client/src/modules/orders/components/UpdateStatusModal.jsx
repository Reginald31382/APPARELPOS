import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import useUpdateOrderStatus from "../hooks/useUpdateOrderStatus";

const STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Refunded"];

const UpdateStatusModal = ({ order, open, onOpenChange }) => {
  const [status, setStatus] = useState("");

  const { mutate, isPending } = useUpdateOrderStatus();

  useEffect(() => {
    if (order) {
      setStatus(order.status);
    }
  }, [order]);

  if (!order) return null;

  const handleSave = () => {
    if (status === order.status) {
      onOpenChange(false);
      return;
    }

    mutate(
      {
        orderId: order._id,
        status,
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <p className="mb-2 text-sm text-gray-500">Current Status</p>

            <div className="rounded-lg border bg-gray-50 p-3 font-medium">
              {order.status}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm text-gray-500">Select New Status</p>

            <div className="space-y-2">
              {STATUSES.map((value) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="status"
                    value={value}
                    checked={status === value}
                    onChange={(e) => setStatus(e.target.value)}
                  />

                  <span>{value}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-lg border px-4 py-2"
            >
              Cancel
            </button>

            <button
              disabled={isPending || status === order.status}
              onClick={handleSave}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateStatusModal;
