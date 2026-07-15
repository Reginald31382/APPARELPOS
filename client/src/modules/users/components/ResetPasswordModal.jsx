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

  const handleSubmit = () => {
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
          setPassword("");
          setConfirmPassword("");
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-500">
          {employee.firstName} {employee.lastName}
        </p>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border p-3"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="rounded-lg border p-3"
        />

        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-lg border px-4 py-2"
          >
            Cancel
          </button>

          <button
            disabled={isPending}
            onClick={handleSubmit}
            className="rounded-lg bg-black px-5 py-2 text-white"
          >
            {isPending ? "Updating..." : "Reset Password"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordModal;
