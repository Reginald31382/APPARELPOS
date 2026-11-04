import { useState } from "react";
import EmployeeForm from "./EmployeeForm";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import useCreateUser from "../hooks/useCreateUser";

const roles = ["Owner", "Admin", "Manager", "Cashier"];

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  role: "Cashier",
};

const AddEmployeeModal = ({ open, onOpenChange }) => {
  const { mutate, isPending } = useCreateUser();

  const [form, setForm] = useState(initialForm);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    mutate(
      {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: form.role,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setForm({ ...initialForm });
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] w-[calc(100%-1rem)] max-w-xl overflow-y-auto rounded-xl p-4 sm:p-6">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-xl font-bold sm:text-2xl">
            Add Employee
          </DialogTitle>
        </DialogHeader>

        <div className="grid min-w-0 gap-5">
          {/* Employee Form */}
          <EmployeeForm form={form} onChange={handleChange} />

          {/* Actions */}
          <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end sm:gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="w-full rounded-lg border px-4 py-3 text-sm font-semibold transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:py-2"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className="w-full rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:py-2"
            >
              {isPending ? "Creating..." : "Create Employee"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeeModal;
