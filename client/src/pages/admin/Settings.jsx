import useSettingsStore from "../../store/settings/useSettingsStore";

const Settings = () => {
  const {
    businessName,
    phone,
    email,
    website,
    address,
    taxRate,
    receiptFooter,
    autoPrintReceipts,
    defaultPaymentMethod,
    updateSettings,
  } = useSettingsStore();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Store Settings</h1>

      <div className="rounded-xl border bg-white p-8 shadow-sm">
        <div className="grid gap-6 md:grid-cols-2">
          <input
            className="rounded-lg border p-3"
            placeholder="Business Name"
            value={businessName}
            onChange={(e) =>
              updateSettings({
                businessName: e.target.value,
              })
            }
          />

          <input
            className="rounded-lg border p-3"
            placeholder="Phone"
            value={phone}
            onChange={(e) =>
              updateSettings({
                phone: e.target.value,
              })
            }
          />

          <input
            className="rounded-lg border p-3"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              updateSettings({
                email: e.target.value,
              })
            }
          />

          <input
            className="rounded-lg border p-3"
            placeholder="Website"
            value={website}
            onChange={(e) =>
              updateSettings({
                website: e.target.value,
              })
            }
          />

          <input
            className="rounded-lg border p-3 md:col-span-2"
            placeholder="Address"
            value={address}
            onChange={(e) =>
              updateSettings({
                address: e.target.value,
              })
            }
          />

          <input
            type="number"
            step="0.01"
            className="rounded-lg border p-3"
            placeholder="Tax Rate"
            value={taxRate}
            onChange={(e) =>
              updateSettings({
                taxRate: Number(e.target.value),
              })
            }
          />

          <select
            className="rounded-lg border p-3"
            value={defaultPaymentMethod}
            onChange={(e) =>
              updateSettings({
                defaultPaymentMethod: e.target.value,
              })
            }
          >
            <option>Cash</option>
            <option>Stripe</option>
          </select>

          <textarea
            className="rounded-lg border p-3 md:col-span-2"
            rows={4}
            placeholder="Receipt Footer"
            value={receiptFooter}
            onChange={(e) =>
              updateSettings({
                receiptFooter: e.target.value,
              })
            }
          />

          <label className="flex items-center gap-3 md:col-span-2">
            <input
              type="checkbox"
              checked={autoPrintReceipts}
              onChange={(e) =>
                updateSettings({
                  autoPrintReceipts: e.target.checked,
                })
              }
            />
            Auto Print Receipts
          </label>
        </div>
      </div>
    </div>
  );
};

export default Settings;
