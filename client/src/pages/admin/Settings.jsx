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

const createForm = (store = {}) => ({
  businessName: store.businessName ?? "",
  phone: store.phone ?? "",
  email: store.email ?? "",
  website: store.website ?? "",
  address: store.address ?? "",
  taxRate: store.taxRate ?? 0,
  receiptFooter: store.receiptFooter ?? "",
  autoPrintReceipts: store.autoPrintReceipts ?? false,
  defaultPaymentMethod: store.defaultPaymentMethod ?? "Cash",
  freeShippingThreshold: store.freeShippingThreshold ?? 150,

  shipping: {
    businessName: store.shipping?.businessName ?? "",
    company: store.shipping?.company ?? "",
    street1: store.shipping?.street1 ?? "",
    street2: store.shipping?.street2 ?? "",
    city: store.shipping?.city ?? "",
    state: store.shipping?.state ?? "",
    zip: store.shipping?.zip ?? "",
    country: store.shipping?.country ?? "US",
    phone: store.shipping?.phone ?? "",
    email: store.shipping?.email ?? "",
    defaultCarrier: store.shipping?.defaultCarrier ?? "USPS",
    defaultService: store.shipping?.defaultService ?? "Ground Advantage",
    packageLength: store.shipping?.packageLength ?? 12,
    packageWidth: store.shipping?.packageWidth ?? 10,
    packageHeight: store.shipping?.packageHeight ?? 2,
    packageWeight: store.shipping?.packageWeight ?? 16,
  },

  shippingRules: {
    freeShippingThreshold: store.shippingRules?.freeShippingThreshold ?? 150,
    lightweightMaxOz: store.shippingRules?.lightweightMaxOz ?? 16,
    defaultCarrier: store.shippingRules?.defaultCarrier ?? "USPS",
    lightweightService:
      store.shippingRules?.lightweightService ?? "Ground Advantage",
    heavyweightService:
      store.shippingRules?.heavyweightService ?? "Priority Mail",
    expressService:
      store.shippingRules?.expressService ?? "Priority Mail Express",
  },
});

const inputStyles =
  "w-full min-w-0 rounded-lg border bg-white p-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:text-base";

const labelStyles = "mb-2 block text-sm font-medium text-gray-700";

const Settings = () => {
  const { data: store, isLoading } = useStore();
  const updateStore = useUpdateStore();

  const [form, setForm] = useState(() => createForm());

  useEffect(() => {
    if (store) {
      setForm(createForm(store));
    }
  }, [store]);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleShippingChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      shipping: {
        ...prev.shipping,
        [field]: value,
      },
    }));
  };

  const handleShippingRulesChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      shippingRules: {
        ...prev.shippingRules,
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    updateStore.mutate(form);
  };

  const handleReset = () => {
    if (!store) return;
    setForm(createForm(store));
  };

  const hasChanges =
    store && JSON.stringify(form) !== JSON.stringify(createForm(store));

  const Section = ({ title, children }) => (
    <section className="min-w-0 overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="border-b px-4 py-4 sm:px-6">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-5 p-4 sm:grid-cols-2 sm:gap-6 sm:p-6">
        {children}
      </div>
    </section>
  );

  const Field = ({ label, description, children, fullWidth = false }) => (
    <div className={`min-w-0 ${fullWidth ? "sm:col-span-2" : ""}`}>
      <label className={labelStyles}>{label}</label>
      {children}
      {description && (
        <p className="mt-2 text-xs leading-relaxed text-gray-500 sm:text-sm">
          {description}
        </p>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-6 text-center text-sm text-gray-500 sm:p-8">
        Loading store settings...
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-5 p-4 sm:space-y-8 sm:p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Store Settings
        </h1>

        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          Configure your business and point-of-sale preferences.
        </p>
      </div>

      {/* Business Information */}
      <Section title="Business Information">
        <Field
          label="Business Name"
          description={fieldDescriptions.businessName}
        >
          <input
            className={inputStyles}
            value={form.businessName}
            placeholder="Your business name"
            onChange={(e) => handleChange("businessName", e.target.value)}
          />
        </Field>

        <Field label="Phone" description={fieldDescriptions.phone}>
          <input
            type="tel"
            className={inputStyles}
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </Field>

        <Field label="Email" description={fieldDescriptions.email}>
          <input
            type="email"
            className={inputStyles}
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </Field>

        <Field label="Website" description={fieldDescriptions.website}>
          <input
            type="url"
            className={inputStyles}
            value={form.website}
            onChange={(e) => handleChange("website", e.target.value)}
          />
        </Field>

        <Field
          label="Address"
          description={fieldDescriptions.address}
          fullWidth
        >
          <input
            className={inputStyles}
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />
        </Field>
      </Section>

      {/* POS Settings */}
      <Section title="POS Settings">
        <Field label="Free Shipping Threshold ($)">
          <input
            type="number"
            min="0"
            className={inputStyles}
            value={form.freeShippingThreshold}
            onChange={(e) =>
              handleChange("freeShippingThreshold", Number(e.target.value))
            }
          />

          <p className="mt-2 text-xs text-gray-500 sm:text-sm">
            Orders at or above this amount receive free shipping.
          </p>
        </Field>

        <Field label="Tax Rate (%)" description={fieldDescriptions.taxRate}>
          <input
            type="number"
            step="0.01"
            className={inputStyles}
            value={form.taxRate}
            onChange={(e) => handleChange("taxRate", Number(e.target.value))}
          />
        </Field>

        <Field
          label="Default Payment"
          description={fieldDescriptions.defaultPaymentMethod}
        >
          <select
            className={inputStyles}
            value={form.defaultPaymentMethod}
            onChange={(e) =>
              handleChange("defaultPaymentMethod", e.target.value)
            }
          >
            <option>Cash</option>
            <option>Stripe</option>
          </select>
        </Field>

        <div className="flex min-w-0 items-start gap-3 rounded-lg border p-4 sm:col-span-2">
          <input
            id="auto-print-receipts"
            type="checkbox"
            checked={form.autoPrintReceipts}
            onChange={(e) =>
              handleChange("autoPrintReceipts", e.target.checked)
            }
            className="mt-1 h-5 w-5 shrink-0 accent-blue-600"
          />

          <label
            htmlFor="auto-print-receipts"
            className="min-w-0 cursor-pointer"
          >
            <span className="block text-sm font-medium text-gray-900">
              Auto Print Receipts
            </span>

            <span className="mt-1 block text-xs leading-relaxed text-gray-500 sm:text-sm">
              {fieldDescriptions.autoPrintReceipts}
            </span>
          </label>
        </div>
      </Section>

      {/* Shipping Settings */}
      <Section title="Shipping Settings">
        <Field label="Company">
          <input
            className={inputStyles}
            value={form.shipping.company}
            onChange={(e) => handleShippingChange("company", e.target.value)}
          />
        </Field>

        <Field label="Shipping Email">
          <input
            type="email"
            className={inputStyles}
            value={form.shipping.email}
            onChange={(e) => handleShippingChange("email", e.target.value)}
          />
        </Field>

        <Field label="Shipping Phone">
          <input
            type="tel"
            className={inputStyles}
            value={form.shipping.phone}
            onChange={(e) => handleShippingChange("phone", e.target.value)}
          />
        </Field>

        <Field label="Street Address">
          <input
            className={inputStyles}
            value={form.shipping.street1}
            onChange={(e) => handleShippingChange("street1", e.target.value)}
          />
        </Field>

        <Field label="City">
          <input
            className={inputStyles}
            value={form.shipping.city}
            onChange={(e) => handleShippingChange("city", e.target.value)}
          />
        </Field>

        <Field label="State">
          <input
            className={inputStyles}
            value={form.shipping.state}
            onChange={(e) => handleShippingChange("state", e.target.value)}
          />
        </Field>

        <Field label="ZIP Code">
          <input
            className={inputStyles}
            value={form.shipping.zip}
            onChange={(e) => handleShippingChange("zip", e.target.value)}
          />
        </Field>
      </Section>

      {/* Shipping Rules */}
      <Section title="Shipping Rules">
        <Field label="Free Shipping Threshold">
          <input
            type="number"
            className={inputStyles}
            value={form.shippingRules.freeShippingThreshold}
            onChange={(e) =>
              handleShippingRulesChange(
                "freeShippingThreshold",
                Number(e.target.value),
              )
            }
          />
        </Field>

        <Field label="Lightweight Maximum (oz)">
          <input
            type="number"
            className={inputStyles}
            value={form.shippingRules.lightweightMaxOz}
            onChange={(e) =>
              handleShippingRulesChange(
                "lightweightMaxOz",
                Number(e.target.value),
              )
            }
          />
        </Field>

        <Field label="Ground Service">
          <input
            className={inputStyles}
            value={form.shippingRules.lightweightService}
            onChange={(e) =>
              handleShippingRulesChange("lightweightService", e.target.value)
            }
          />
        </Field>

        <Field label="Heavy Package Service">
          <input
            className={inputStyles}
            value={form.shippingRules.heavyweightService}
            onChange={(e) =>
              handleShippingRulesChange("heavyweightService", e.target.value)
            }
          />
        </Field>

        <Field label="Express Service">
          <input
            className={inputStyles}
            value={form.shippingRules.expressService}
            onChange={(e) =>
              handleShippingRulesChange("expressService", e.target.value)
            }
          />
        </Field>
      </Section>

      {/* Receipt Settings */}
      <Section title="Receipt">
        <Field
          label="Receipt Footer"
          description={fieldDescriptions.receiptFooter}
          fullWidth
        >
          <textarea
            rows={5}
            className={`${inputStyles} resize-y`}
            value={form.receiptFooter}
            onChange={(e) => handleChange("receiptFooter", e.target.value)}
          />
        </Field>
      </Section>

      {/* Receipt Preview */}
      <section className="min-w-0 rounded-xl border bg-gray-50 p-4 sm:p-5">
        <h2 className="mb-4 font-semibold text-gray-900">Receipt Preview</h2>

        <div className="mx-auto w-full max-w-xs rounded-lg border bg-white p-4 font-mono text-sm shadow-sm">
          <div className="break-words text-center font-bold">
            {form.businessName || "Your Business"}
          </div>

          {form.phone && (
            <div className="mt-1 break-words text-center text-xs text-gray-600">
              {form.phone}
            </div>
          )}

          {form.website && (
            <div className="mt-1 break-words text-center text-xs text-gray-600">
              {form.website}
            </div>
          )}

          <hr className="my-3" />

          <div className="flex justify-between gap-2">
            <span>Subtotal</span>
            <span>$30.00</span>
          </div>

          <div className="mt-1 flex justify-between gap-2">
            <span>Tax</span>
            <span>${(30 * (Number(form.taxRate) / 100)).toFixed(2)}</span>
          </div>

          <div className="mt-2 flex justify-between gap-2 border-t pt-2 font-bold">
            <span>Total</span>
            <span>${(30 + 30 * (Number(form.taxRate) / 100)).toFixed(2)}</span>
          </div>

          <div className="mt-4 break-words border-t pt-3 text-center text-xs text-gray-600">
            {form.receiptFooter || "Your receipt footer will appear here."}
          </div>
        </div>
      </section>

      {/* Save and Reset Actions */}
      <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={handleReset}
          disabled={!hasChanges || updateStore.isPending}
          className="w-full rounded-lg border px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          Reset
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={!hasChanges || updateStore.isPending}
          className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400 sm:w-auto"
        >
          {updateStore.isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default Settings;
