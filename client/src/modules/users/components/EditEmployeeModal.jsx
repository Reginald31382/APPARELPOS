import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import EmployeeForm from "./EmployeeForm";
import useUpdateUser from "../hooks/useUpdateUser";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "Cashier",
  isActive: true,
};

const EditEmployeeModal = ({ employee, open, onOpenChange }) => {
  const { mutate, isPending } = useUpdateUser();

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!employee) return;

    setForm({
      firstName: employee.firstName || "",
      lastName: employee.lastName || "",
      email: employee.email || "",
      phone: employee.phone || "",
      role: employee.role || "Cashier",
      isActive: employee.isActive ?? true,
    });
  }, [employee]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    if (!employee) return;

    mutate(
      {
        id: employee._id,
        ...form,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] w-[calc(100%-1rem)] max-w-xl overflow-y-auto rounded-xl p-4 sm:p-6">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-xl font-bold sm:text-2xl">
            Edit Employee
          </DialogTitle>
        </DialogHeader>

        {/* Employee Form */}
        <EmployeeForm
          form={form}
          onChange={handleChange}
          showPasswordFields={false}
        />

        {/* Actions */}
        <div className="mt-5 flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end sm:gap-3">
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
            disabled={isPending}
            onClick={handleSave}
            className="w-full rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:py-2"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditEmployeeModal;
