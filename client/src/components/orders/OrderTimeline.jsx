const OrderTimeline = ({ timeline = [] }) => {
  return (
    <div className="rounded-lg border bg-white p-5">
      <h3 className="mb-4 text-lg font-semibold">Order Timeline</h3>

      <div className="space-y-5">
        {timeline.map((event, index) => (
          <div key={index} className="flex gap-4">
            <div className="mt-1 h-3 w-3 rounded-full bg-green-500" />

            <div>
              <p className="font-medium">{event.title}</p>

              <p className="text-sm text-gray-500">{event.description}</p>

              <p className="text-xs text-gray-400">
                {new Date(event.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTimeline;
