import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import useResetPassword from "../hooks/useResetPassword";

const ResetPasswordModal = ({ employee, open, onOpenChange }) => {
  const { mutate, isPending } = useResetPassword();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!employee) return null;

  const resetForm = () => {
    setPassword("");
    setConfirmPassword("");
  };

  const handleClose = (nextOpen) => {
    if (!nextOpen && !isPending) {
      resetForm();
    }

    onOpenChange(nextOpen);
  };

  const handleSubmit = () => {
    if (!password || !confirmPassword) {
      alert("Please complete both password fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    mutate(
      {
        id: employee._id,
        password,
      },
      {
        onSuccess: () => {
          resetForm();
          onOpenChange(false);
        },
      },
    );
  };

  const inputStyles =
    "w-full rounded-lg border bg-white p-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:text-base";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[calc(100%-1rem)] max-w-md rounded-xl p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold sm:text-2xl">
            Reset Password
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Employee Information */}
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="font-semibold text-gray-900">
              {employee.firstName} {employee.lastName}
            </p>

            <p className="mt-1 break-all text-sm text-gray-500">
              {employee.email}
            </p>
          </div>

          {/* Password Fields */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="reset-password"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                New Password
              </label>

              <input
                id="reset-password"
                type="password"
                autoComplete="new-password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputStyles}
              />
            </div>

            <div>
              <label
                htmlFor="confirm-reset-password"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </label>

              <input
                id="confirm-reset-password"
                type="password"
                autoComplete="new-password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputStyles}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end sm:gap-3">
            <button
              type="button"
              onClick={() => handleClose(false)}
              disabled={isPending}
              className="w-full rounded-lg border px-4 py-3 text-sm font-semibold transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:py-2"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isPending}
              onClick={handleSubmit}
              className="w-full rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:py-2"
            >
              {isPending ? "Updating..." : "Reset Password"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordModal;
