const InventoryHistory = ({ history }) => {
  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Recent Inventory Activity</h2>

        <p className="mt-1 text-gray-500">
          Latest inventory adjustments for this product.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Change</th>
              <th className="p-4 text-left">Reason</th>
              <th className="p-4 text-left">User</th>
            </tr>
          </thead>

          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-10 text-center text-gray-500">
                  No inventory activity yet.
                </td>
              </tr>
            ) : (
              history.map((item) => (
                <tr key={item._id} className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>

                  <td
                    className={`p-4 font-semibold ${
                      item.adjustment > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {item.adjustment > 0 ? "+" : ""}
                    {item.adjustment}
                  </td>

                  <td className="p-4">{item.reason}</td>

                  <td className="p-4">
                    {item.performedBy?.firstName} {item.performedBy?.lastName}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default InventoryHistory;
