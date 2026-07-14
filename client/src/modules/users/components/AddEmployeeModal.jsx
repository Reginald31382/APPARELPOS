import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import useCreateUser from "../hooks/useCreateUser";

const roles = ["Owner", "Admin", "Manager", "Cashier"];

const AddEmployeeModal = ({ open, onOpenChange }) => {
  const { mutate, isPending } = useCreateUser();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "Cashier",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
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

          setForm({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
            role: "Cashier",
          });
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add Employee</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <input
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            className="rounded-lg border p-3"
          />

          <input
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            className="rounded-lg border p-3"
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="rounded-lg border p-3"
          />

          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="rounded-lg border p-3"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="rounded-lg border p-3"
          >
            {roles.map((role) => (
              <option key={role}>{role}</option>
            ))}
          </select>

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="rounded-lg border p-3"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="rounded-lg border p-3"
          />

          <div className="flex justify-end gap-3">
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-lg border px-4 py-2"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="rounded-lg bg-black px-5 py-2 text-white"
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
