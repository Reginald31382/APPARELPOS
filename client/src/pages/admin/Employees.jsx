import AddEmployeeModal from "../../modules/users/components/AddEmployeeModal";

import { useState } from "react";

import useUsers from "../../modules/users/hooks/useUsers";

const Employees = () => {
  const { data: users = [], isLoading } = useUsers();
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();

    return (
      fullName.includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  if (isLoading) {
    return <p>Loading employees...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Employees</h1>

        <button
          onClick={() => setModalOpen(true)}
          className="rounded-lg bg-black px-4 py-2 text-white"
        >
          {" "}
          + Add Employee
        </button>
      </div>

      <input
        type="text"
        placeholder="Search employee..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-80 rounded-lg border p-3"
      />

      <div className="overflow-hidden rounded-xl border bg-white">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Employee</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-center">Role</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Last Login</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-4 font-medium">
                  {user.firstName} {user.lastName}
                </td>

                <td className="p-4">{user.email}</td>

                <td className="p-4">{user.phone || "-"}</td>

                <td className="p-4 text-center">{user.role}</td>

                <td className="p-4 text-center">
                  <span
                    className={`rounded-full px-3 py-1 text-sm ${
                      user.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.isActive ? "Active" : "Disabled"}
                  </span>
                </td>

                <td className="p-4 text-center">
                  {user.lastLogin
                    ? new Date(user.lastLogin).toLocaleDateString()
                    : "Never"}
                </td>

                <td className="p-4 text-center">
                  <button className="rounded-lg border px-3 py-1">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <AddEmployeeModal open={modalOpen} onOpenChange={setModalOpen} />
      </div>
    </div>
  );
};

export default Employees;
