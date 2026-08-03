import { CheckCircle, Circle, Truck, Package } from "lucide-react";

const iconMap = {
  "Order Created": <CheckCircle className="h-5 w-5 text-green-600" />,
  "USPS Accepted": <Package className="h-5 w-5 text-blue-600" />,
  "Out for Delivery": <Truck className="h-5 w-5 text-orange-500" />,
  Delivered: <CheckCircle className="h-5 w-5 text-green-600" />,
};

const OrderTimeline = ({ timeline = [] }) => {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-lg font-semibold">Order Timeline</h2>

      {timeline.length === 0 ? (
        <p className="text-sm text-gray-500">No timeline events yet.</p>
      ) : (
        <div className="space-y-5">
          {timeline.map((event, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex flex-col items-center">
                {iconMap[event.title] ?? (
                  <Circle className="h-5 w-5 text-gray-400" />
                )}

                {index !== timeline.length - 1 && (
                  <div className="mt-1 h-full w-px bg-gray-300" />
                )}
              </div>

              <div className="pb-5">
                <div className="font-medium">{event.title}</div>

                {event.description && (
                  <div className="text-sm text-gray-500">
                    {event.description}
                  </div>
                )}

                <div className="mt-1 text-xs text-gray-400">
                  {new Date(event.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderTimeline;
