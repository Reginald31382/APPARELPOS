import useInventoryHistory from "../hooks/useInventoryHistory";

const InventoryHistoryTable = () => {
  const { data = [], isLoading } = useInventoryHistory();

  if (isLoading) {
    return <p>Loading history...</p>;
  }

  return (
    <div className="mt-8 overflow-x-auto rounded-xl border bg-white">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Product</th>
            <th className="p-3 text-left">SKU</th>
            <th className="p-3 text-left">Change</th>
            <th className="p-3 text-left">Reason</th>
            <th className="p-3 text-left">User</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item._id} className="border-t hover:bg-gray-50">
              <td className="p-3">
                {new Date(item.createdAt).toLocaleDateString()}
              </td>

              <td className="p-3">{item.productName}</td>

              <td className="p-3">{item.sku}</td>

              <td
                className={`p-3 font-semibold ${
                  item.adjustment > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {item.adjustment > 0 ? "+" : ""}
                {item.adjustment}
              </td>

              <td className="p-3">{item.reason}</td>

              <td className="p-3">
                {item.performedBy?.firstName} {item.performedBy?.lastName}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryHistoryTable;
