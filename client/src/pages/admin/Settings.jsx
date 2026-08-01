import { useEffect, useState } from "react";
import useStore from "../../modules/settings/hooks/useStore";
import useUpdateStore from "../../modules/settings/hooks/useUpdateStore";

const fieldDescriptions = {
  businessName: "Displayed on receipts, reports, invoices, and exports.",
  phone: "Printed on customer receipts as your business contact number.",
  email:
    "Used as the primary contact email on receipts and future customer communications.",
  website: "Printed at the bottom of receipts and reports.",
  address: "Displayed on receipts and printable documents.",
  taxRate: "Applied automatically to taxable sales at checkout.",
  defaultPaymentMethod:
    "Preselects the payment method when creating a new sale.",
  receiptFooter:
    "Printed at the bottom of every receipt after a completed purchase.",
  autoPrintReceipts:
    "Automatically opens the print dialog after every completed sale.",
};

const Settings = () => {
  const { data: store, isLoading } = useStore();

  const updateStore = useUpdateStore();

  const [form, setForm] = useState({
    businessName: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    taxRate: 0,
    receiptFooter: "",
    autoPrintReceipts: false,
    defaultPaymentMethod: "Cash",
  });

  useEffect(() => {
    if (!store) return;

    setForm({
      businessName: store.businessName,
      phone: store.phone,
      email: store.email,
      website: store.website,
      address: store.address,
      taxRate: store.taxRate,
      receiptFooter: store.receiptFooter,
      autoPrintReceipts: store.autoPrintReceipts,
      defaultPaymentMethod: store.defaultPaymentMethod,
      freeShippingThreshold: store.freeShippingThreshold ?? 150,
    });
  }, [store]);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    updateStore.mutate(form);
  };

  const handleReset = () => {
    if (!store) return;

    setForm({
      businessName: store.businessName,
      phone: store.phone,
      email: store.email,
      website: store.website,
      address: store.address,
      taxRate: store.taxRate,
      receiptFooter: store.receiptFooter,
      autoPrintReceipts: store.autoPrintReceipts,
      defaultPaymentMethod: store.defaultPaymentMethod,
      freeShippingThreshold: store.freeShippingThreshold ?? 150,
    });
  };

  const hasChanges =
    store &&
    JSON.stringify(form) !==
      JSON.stringify({
        businessName: store.businessName,
        phone: store.phone,
        email: store.email,
        website: store.website,
        address: store.address,
        taxRate: store.taxRate,
        receiptFooter: store.receiptFooter,
        autoPrintReceipts: store.autoPrintReceipts,
        defaultPaymentMethod: store.defaultPaymentMethod,
        freeShippingThreshold: store.freeShippingThreshold ?? 150,
      });

  if (isLoading) {
    return <div className="p-8 text-center">Loading store settings...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Store Settings</h1>

        <p className="mt-2 text-gray-500">
          Configure your business and point-of-sale preferences.
        </p>
      </div>

      {/* Business Information */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold">Business Information</h2>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Business Name
            </label>

            <input
              className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
              value={form.businessName}
              placeholder="Your business name"
              onChange={(e) => handleChange("businessName", e.target.value)}
            />

            <p className="mt-2 text-sm text-gray-500">
              {fieldDescriptions.businessName}
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Phone
            </label>

            <input
              className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
            <p className="mt-2 text-sm text-gray-500">
              {fieldDescriptions.phone}
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            <p className="mt-2 text-sm text-gray-500">
              {fieldDescriptions.email}
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Website
            </label>

            <input
              className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
              value={form.website}
              onChange={(e) => handleChange("website", e.target.value)}
            />
            <p className="mt-2 text-sm text-gray-500">
              {fieldDescriptions.website}
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Address
            </label>

            <input
              className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
            <p className="mt-2 text-sm text-gray-500">
              {fieldDescriptions.address}
            </p>
          </div>
        </div>
      </div>

      {/* POS Settings */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold">POS Settings</h2>
        </div>
        <div className="grid gap-6 p-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Free Shipping Threshold ($)
            </label>

            <input
              type="number"
              className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
              value={form.freeShippingThreshold}
              onChange={(e) =>
                handleChange("freeShippingThreshold", Number(e.target.value))
              }
            />

            <p className="mt-2 text-sm text-gray-500">
              Orders at or above this amount receive free shipping.
            </p>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Tax Rate (%)
            </label>

            <input
              type="number"
              step="0.01"
              className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
              value={form.taxRate}
              onChange={(e) => handleChange("taxRate", Number(e.target.value))}
            />
            <p className="mt-2 text-sm text-gray-500">
              {fieldDescriptions.taxRate}
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Default Payment
            </label>

            <select
              className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
              value={form.defaultPaymentMethod}
              onChange={(e) =>
                handleChange("defaultPaymentMethod", e.target.value)
              }
            >
              <option>Cash</option>
              <option>Stripe</option>
            </select>
            <p className="mt-2 text-sm text-gray-500">
              {fieldDescriptions.defaultPaymentMethod}
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-3 rounded-lg border p-4">
              <input
                type="checkbox"
                checked={form.autoPrintReceipts}
                onChange={(e) =>
                  handleChange("autoPrintReceipts", e.target.checked)
                }
              />

              <div>
                <p className="font-medium">Auto Print Receipts</p>
              </div>
              <p className="text-sm text-gray-500">
                Automatically print receipts after every completed sale.
              </p>
            </label>
          </div>
        </div>
      </div>

      {/* Receipt */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold">Receipt</h2>
        </div>

        <div className="p-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Receipt Footer
          </label>

          <textarea
            rows={5}
            className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
            value={form.receiptFooter}
            onChange={(e) => handleChange("receiptFooter", e.target.value)}
          />
          <p className="mt-2 text-sm text-gray-500">
            {fieldDescriptions.receiptFooter}
          </p>
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={handleReset}
          disabled={!hasChanges}
          className="rounded-lg border px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Reset
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={!hasChanges || updateStore.isPending}
          className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {updateStore.isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="mt-6 rounded-lg border bg-gray-50 p-5">
        <h3 className="mb-4 font-semibold text-gray-800">Receipt Preview</h3>

        <div className="mx-auto max-w-xs rounded border bg-white p-4 font-mono text-sm shadow-sm">
          <div className="text-center font-bold">
            {form.businessName || "Your Business"}
          </div>

          {form.phone && (
            <div className="text-center text-xs text-gray-600">
              {form.phone}
            </div>
          )}

          {form.website && (
            <div className="text-center text-xs text-gray-600">
              {form.website}
            </div>
          )}

          <hr className="my-3" />

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>$30.00</span>
          </div>

          <div className="flex justify-between">
            <span>Tax</span>
            <span>${(30 * (form.taxRate / 100)).toFixed(2)}</span>
          </div>

          <div className="mt-2 flex justify-between border-t pt-2 font-bold">
            <span>Total</span>
            <span>${(30 + 30 * (form.taxRate / 100)).toFixed(2)}</span>
          </div>

          <div className="mt-4 border-t pt-3 text-center text-xs text-gray-600">
            {form.receiptFooter || "Your receipt footer will appear here."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
