import { managerOverride } from "../../../services/authService";
import { notifyError, notifySuccess } from "../../../utils/notifications";
import { useState } from "react";

const ManagerApprovalModal = ({ open, onClose, onApprove }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await managerOverride({
        email,
        password,
      });

      onApprove(result);
      notifySuccess("Manager approval granted.");

      setEmail("");
      setPassword("");
    } catch (error) {
      notifyError(error.response?.data?.message || "Manager approval failed.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-2 text-2xl font-bold">Manager Approval</h2>

        <p className="mb-6 text-sm text-gray-500">
          A manager must approve this discount.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Manager Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border p-3"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Manager Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border p-3"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-5 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-black px-5 py-2 text-white"
            >
              Approve
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManagerApprovalModal;
