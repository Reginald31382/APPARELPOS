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
import useInventoryHistory from "../hooks/useInventoryHistory";

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

const InventoryHistoryTable = () => {
  const { data = [], isLoading } = useInventoryHistory();
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const todayChanges = data.filter((item) => {
    const today = new Date().toDateString();

    return new Date(item.createdAt).toDateString() === today;
  }).length;

  const [openDates, setOpenDates] = useState({
    [today]: true,
  });
  const groupedHistory = useMemo(() => {
    return data.reduce((groups, item) => {
      const date = new Date(item.createdAt).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      if (!groups[date]) {
        groups[date] = [];
      }

      groups[date].push(item);

      return groups;
    }, {});
  }, [data]);

  useEffect(() => {
    const today = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    if (groupedHistory[today]) {
      setOpenDates((prev) => ({
        ...prev,
        [today]: true,
      }));
    }
  }, [groupedHistory]);

  if (isLoading) {
    return <p>Loading history...</p>;
  }

  return (
    <div className="space-y-5">
      {Object.entries(groupedHistory).map(([date, items]) => (
        <div
          key={date}
          className="overflow-hidden rounded-xl border bg-white shadow-sm"
        >
          <button
            onClick={() =>
              setOpenDates((prev) => ({
                ...prev,
                [date]: !prev[date],
              }))
            }
            className="sticky top-0 z-10 flex w-full items-center justify-between border-b bg-gray-50 px-6 py-4"
          >
            <div className="flex items-center gap-3">
              {openDates[date] ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}

              <h3 className="font-semibold">{date}</h3>
            </div>

            <span className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
              {items.length}
            </span>
          </button>

          {openDates[date] && (
            <div className="divide-y">
              {items.map((item) => {
                const reason =
                  reasonStyles[item.reason] ||
                  reasonStyles["Manual Adjustment"];

                const Icon = reason.icon;

                return (
                  <div
                    key={item._id}
                    className="grid grid-cols-[110px_1fr_160px] items-center gap-6 border-t px-6 py-4 hover:bg-gray-50"
                  >
                    {/* Time */}
                    <div className="text-sm font-medium text-gray-500">
                      {new Date(item.createdAt).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </div>

                    {/* Product */}
                    <div>
                      <p className="font-semibold">{item.productName}</p>

                      <p className="text-sm text-gray-500">
                        {item.color} • {item.size} • {item.sku}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {item.performedBy?.firstName}
                        {item.performedBy?.lastName}
                      </p>
                    </div>

                    {/* Right Side */}
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`text-xl font-bold ${
                          item.adjustment > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {item.adjustment > 0 ? "+" : ""}
                        {item.adjustment}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          reason.className
                        }`}
                      >
                        {item.reason}
                      </span>
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
