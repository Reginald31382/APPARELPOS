import { useState } from "react";
import { updateSettings } from "../../modules/settings/services/settingsService";
import { useNavigate } from "react-router-dom";

import { register } from "../../modules/auth/services/authService";

import useAuthStore from "../../modules/auth/store/useAuthStore";

const Setup = () => {
  const navigate = useNavigate();

  const login = useAuthStore((state) => state.login);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    businessName: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        role: "Admin",
      });

      // Save the initial store settings
      await updateSettings(
        {
          businessName: form.businessName,
        },
        response.token,
      );

      // Save login information
      login(response);

      // Go to dashboard
      navigate("/admin");
    } catch (error) {
      alert(error.response?.data?.message || "Setup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl rounded-xl bg-white p-8 shadow-xl"
      >
        <h1 className="mb-2 text-4xl font-bold">Welcome to J.Rome POS</h1>

        <p className="mb-8 text-gray-500">Let's configure your store.</p>

        <div className="space-y-4">
          <input
            name="businessName"
            placeholder="Business Name"
            value={form.businessName}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          />

          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          />

          <button
            disabled={loading}
            className="w-full rounded-lg bg-black py-3 text-white transition hover:bg-gray-800"
          >
            {loading ? "Creating Store..." : "Create Store"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Setup;
