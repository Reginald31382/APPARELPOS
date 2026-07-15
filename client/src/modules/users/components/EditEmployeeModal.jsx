import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import EmployeeForm from "./EmployeeForm";
import useUpdateUser from "../hooks/useUpdateUser";

const EditEmployeeModal = ({ employee, open, onOpenChange }) => {
  const { mutate, isPending } = useUpdateUser();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "Cashier",
    isActive: true,
  });

  useEffect(() => {
    if (!employee) return;

    setForm({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone || "",
      role: employee.role,
      isActive: employee.isActive,
    });
  }, [employee]);

  if (!employee) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.name === "isActive" ? e.target.value : e.target.value,
    });
  };

  const handleSave = () => {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
        </DialogHeader>

        <EmployeeForm
          form={form}
          onChange={handleChange}
          showPasswordFields={false}
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-lg border px-4 py-2"
          >
            Cancel
          </button>

          <button
            disabled={isPending}
            onClick={handleSave}
            className="rounded-lg bg-black px-5 py-2 text-white"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditEmployeeModal;
