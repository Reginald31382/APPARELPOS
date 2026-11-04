import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Package,
  Truck,
  RotateCcw,
  ClipboardList,
  Pencil,
} from "lucide-react";

import useInventoryHistory from "@/modules/product/hooks/useInventoryHistory";

const reasonStyles = {
  "Receiving Shipment": {
    icon: Truck,
    className: "bg-green-100 text-green-700",
  },
  Sale: {
    icon: Package,
    className: "bg-blue-100 text-blue-700",
  },
  Return: {
    icon: RotateCcw,
    className: "bg-orange-100 text-orange-700",
  },
  "Inventory Count": {
    icon: ClipboardList,
    className: "bg-purple-100 text-purple-700",
  },
  "Manual Adjustment": {
    icon: Pencil,
    className: "bg-gray-100 text-gray-700",
  },
};

const getFormattedDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const InventoryHistoryTable = () => {
  const { data = [], isLoading } = useInventoryHistory();

  const today = getFormattedDate(new Date());

  const [openDates, setOpenDates] = useState({
    [today]: true,
  });

  const groupedHistory = useMemo(() => {
    return data.reduce((groups, item) => {
      const date = getFormattedDate(item.createdAt);

      if (!groups[date]) {
        groups[date] = [];
      }

      groups[date].push(item);

      return groups;
    }, {});
  }, [data]);

  useEffect(() => {
    if (groupedHistory[today]) {
      setOpenDates((prev) => ({
        ...prev,
        [today]: true,
      }));
    }
  }, [groupedHistory, today]);

  if (isLoading) {
    return (
      <div className="py-8 text-center text-sm text-gray-500">
        Loading history...
      </div>
    );
  }

  if (Object.keys(groupedHistory).length === 0) {
    return (
      <div className="py-10 text-center">
        <ClipboardList className="mx-auto mb-3 text-gray-300" size={32} />

        <p className="font-medium text-gray-700">No inventory history yet</p>

        <p className="mt-1 text-sm text-gray-400">
          Inventory adjustments and movements will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-4 sm:space-y-5">
      {Object.entries(groupedHistory).map(([date, items]) => (
        <div
          key={date}
          className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
        >
          {/* Date Header */}
          <button
            type="button"
            onClick={() =>
              setOpenDates((prev) => ({
                ...prev,
                [date]: !prev[date],
              }))
            }
            aria-expanded={Boolean(openDates[date])}
            className="flex w-full items-center justify-between gap-3 border-b border-gray-100 bg-gray-50 px-3 py-4 text-left transition hover:bg-gray-100 sm:px-6"
          >
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              {openDates[date] ? (
                <ChevronDown size={18} className="shrink-0 text-gray-500" />
              ) : (
                <ChevronRight size={18} className="shrink-0 text-gray-500" />
              )}

              <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
                {date}
              </h3>
            </div>

            <span className="shrink-0 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
              {items.length}
            </span>
          </button>

          {/* History Entries */}
          {openDates[date] && (
            <div className="divide-y divide-gray-100">
              {items.map((item) => {
                const reason =
                  reasonStyles[item.reason] ||
                  reasonStyles["Manual Adjustment"];

                const Icon = reason.icon;

                return (
                  <div
                    key={item._id}
                    className="p-4 transition hover:bg-gray-50 sm:px-6 sm:py-5"
                  >
                    {/* Mobile and Desktop Entry */}
                    <div className="flex flex-col gap-3 sm:grid sm:grid-cols-[100px_minmax(0,1fr)_150px] sm:items-center sm:gap-4 lg:grid-cols-[110px_minmax(0,1fr)_160px] lg:gap-6">
                      {/* Time */}
                      <div className="flex items-center gap-2 text-xs font-medium text-gray-500 sm:block sm:text-sm">
                        <span className="rounded-md bg-gray-100 px-2 py-1 sm:bg-transparent sm:px-0 sm:py-0">
                          {new Date(item.createdAt).toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      {/* Product Details */}
                      <div className="min-w-0">
                        <p className="break-words text-sm font-semibold text-gray-900 sm:text-base">
                          {item.productName}
                        </p>

                        <p className="mt-1 break-words text-xs text-gray-500 sm:text-sm">
                          {[item.color, item.size, item.sku]
                            .filter(Boolean)
                            .join(" • ") || "No variant details"}
                        </p>

                        <p className="mt-1 break-words text-xs text-gray-400">
                          {[
                            item.performedBy?.firstName,
                            item.performedBy?.lastName,
                          ]
                            .filter(Boolean)
                            .join(" ") || "Unknown user"}
                        </p>
                      </div>

                      {/* Adjustment and Reason */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                        <span
                          className={`text-xl font-bold tabular-nums ${
                            item.adjustment > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {item.adjustment > 0 ? "+" : ""}
                          {item.adjustment}
                        </span>

                        <span
                          className={`inline-flex max-w-full items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${reason.className}`}
                        >
                          <Icon size={13} />
                          {item.reason}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default InventoryHistoryTable;
