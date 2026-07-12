import useUsers from "../../modules/users/hooks/useUsers";

const Employees = () => {
  const { data = [], isLoading } = useUsers();

  if (isLoading) {
    return <p>Loading employees...</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Employees</h1>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {data.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-4">
                  {user.firstName} {user.lastName}
                </td>

                <td className="p-4">{user.email}</td>

                <td className="p-4">{user.role}</td>

                <td className="p-4">{user.isActive ? "Active" : "Disabled"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employees;
