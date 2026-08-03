import { useEffect, useState } from "react";
import useShippingSettings from "../modules/settings/hooks/useShippingSettings";
import useUpdateShippingSettings from "../modules/settings/hooks/useUpdateShippingSettings";

export default function ShippingSettings() {
  const { data } = useShippingSettings();

  const { mutate, isPending } = useUpdateShippingSettings();

  const [form, setForm] = useState({});

  useEffect(() => {
    if (data) {
      setForm(data);
    }
  }, [data]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const save = () => {
    mutate(form);
  };

  if (!data) return <p>Loading...</p>;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <h1 className="text-3xl font-bold">Shipping Settings</h1>

      <div className="grid gap-5 md:grid-cols-2">
        <input
          name="businessName"
          value={form.businessName}
          onChange={handleChange}
          placeholder="Business Name"
          className="rounded border p-3"
        />

        <input
          name="company"
          value={form.company}
          onChange={handleChange}
          placeholder="Company"
          className="rounded border p-3"
        />

        <input
          name="street1"
          value={form.street1}
          onChange={handleChange}
          placeholder="Street"
          className="rounded border p-3"
        />

        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="City"
          className="rounded border p-3"
        />

        <input
          name="state"
          value={form.state}
          onChange={handleChange}
          placeholder="State"
          className="rounded border p-3"
        />

        <input
          name="zip"
          value={form.zip}
          onChange={handleChange}
          placeholder="Zip"
          className="rounded border p-3"
        />

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="rounded border p-3"
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="rounded border p-3"
        />

        <input
          name="defaultCarrier"
          value={form.defaultCarrier}
          onChange={handleChange}
          placeholder="Carrier"
          className="rounded border p-3"
        />

        <input
          name="defaultService"
          value={form.defaultService}
          onChange={handleChange}
          placeholder="Service"
          className="rounded border p-3"
        />

        <input
          name="packageLength"
          value={form.packageLength}
          onChange={handleChange}
          placeholder="Length"
          className="rounded border p-3"
        />

        <input
          name="packageWidth"
          value={form.packageWidth}
          onChange={handleChange}
          placeholder="Width"
          className="rounded border p-3"
        />

        <input
          name="packageHeight"
          value={form.packageHeight}
          onChange={handleChange}
          placeholder="Height"
          className="rounded border p-3"
        />

        <input
          name="packageWeight"
          value={form.packageWeight}
          onChange={handleChange}
          placeholder="Weight"
          className="rounded border p-3"
        />
      </div>

      <button
        onClick={save}
        disabled={isPending}
        className="rounded-lg bg-black px-6 py-3 text-white"
      >
        Save Shipping Settings
      </button>
    </div>
  );
}
