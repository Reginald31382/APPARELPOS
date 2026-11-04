import { useState } from "react";
import { Search, Plus, Pencil, KeyRound } from "lucide-react";

import AddEmployeeModal from "../../modules/users/components/AddEmployeeModal";
import EditEmployeeModal from "../../modules/users/components/EditEmployeeModal";
import ResetPasswordModal from "../../modules/users/components/ResetPasswordModal";

import useUsers from "../../modules/users/hooks/useUsers";

const Employees = () => {
  const { data: users = [], isLoading } = useUsers();

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((user) => {
    const fullName =
      `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
    const searchText = search.toLowerCase().trim();

    return (
      fullName.includes(searchText) ||
      (user.email || "").toLowerCase().includes(searchText)
    );
  });

  const formatLastLogin = (lastLogin) => {
    return lastLogin
      ? new Date(lastLogin).toLocaleString([], {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "Never";
  };

  const handleEdit = (user) => {
    setSelectedEmployee(user);
    setEditOpen(true);
  };

  const handlePasswordReset = (user) => {
    setSelectedEmployee(user);
    setPasswordOpen(true);
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
          Loading employees...
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-5 p-4 sm:space-y-6 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Employees
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage employee accounts and access.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:w-auto"
        >
          <Plus size={18} />
          Add Employee
        </button>
      </div>

      {/* Search and Employee Count */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <p className="text-sm text-gray-500">
          {filteredUsers.length}{" "}
          {filteredUsers.length === 1 ? "employee" : "employees"}
        </p>
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 ? (
        <div className="rounded-xl border bg-white p-8 text-center">
          <p className="font-medium text-gray-700">
            {users.length === 0
              ? "No employees found."
              : "No employees match your search."}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Try another search or add a new employee.
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Employee Cards */}
          <div className="space-y-3 md:hidden">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="rounded-xl border bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="break-words font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </h3>

                    <p className="mt-1 break-all text-sm text-gray-500">
                      {user.email}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {user.phone || "No phone number"}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                      user.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.isActive ? "Active" : "Disabled"}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 border-t pt-3">
                  <div>
                    <p className="text-xs text-gray-500">Role</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {user.role}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Last Login</p>
                    <p className="mt-1 text-sm text-gray-700">
                      {formatLastLogin(user.lastLogin)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(user)}
                    className="flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition hover:bg-gray-50"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePasswordReset(user)}
                    className="flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-3 py-2.5 text-sm font-medium transition hover:bg-gray-200"
                  >
                    <KeyRound size={16} />
                    Password
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Employee Table */}
          <div className="hidden overflow-hidden rounded-xl border bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="whitespace-nowrap p-4 text-left text-sm font-semibold">
                      Employee
                    </th>

                    <th className="whitespace-nowrap p-4 text-left text-sm font-semibold">
                      Email
                    </th>

                    <th className="whitespace-nowrap p-4 text-left text-sm font-semibold">
                      Phone
                    </th>

                    <th className="whitespace-nowrap p-4 text-center text-sm font-semibold">
                      Role
                    </th>

                    <th className="whitespace-nowrap p-4 text-center text-sm font-semibold">
                      Status
                    </th>

                    <th className="whitespace-nowrap p-4 text-center text-sm font-semibold">
                      Last Login
                    </th>

                    <th className="whitespace-nowrap p-4 text-center text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="border-t transition hover:bg-gray-50"
                    >
                      <td className="whitespace-nowrap p-4 font-medium">
                        {user.firstName} {user.lastName}
                      </td>

                      <td className="p-4">{user.email}</td>

                      <td className="whitespace-nowrap p-4">
                        {user.phone || "-"}
                      </td>

                      <td className="p-4 text-center">{user.role}</td>

                      <td className="p-4 text-center">
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-medium ${
                            user.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {user.isActive ? "Active" : "Disabled"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap p-4 text-center text-sm">
                        {formatLastLogin(user.lastLogin)}
                      </td>

                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(user)}
                            className="rounded-lg border px-3 py-2 text-sm transition hover:bg-gray-100"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handlePasswordReset(user)}
                            className="rounded-lg bg-gray-200 px-3 py-2 text-sm transition hover:bg-gray-300"
                          >
                            Password
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Employee Modals */}
      <AddEmployeeModal open={modalOpen} onOpenChange={setModalOpen} />

      <EditEmployeeModal
        employee={selectedEmployee}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <ResetPasswordModal
        employee={selectedEmployee}
        open={passwordOpen}
        onOpenChange={setPasswordOpen}
      />
    </div>
  );
};

export default Employees;
