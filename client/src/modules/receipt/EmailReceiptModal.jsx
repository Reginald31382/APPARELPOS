import { useEffect, useState } from "react";

const EmailReceiptModal = ({
  open,
  onOpenChange,
  defaultEmail = "",
  onSend,
}) => {
  const [email, setEmail] = useState(defaultEmail);

  useEffect(() => {
    setEmail(defaultEmail);
  }, [defaultEmail, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-2 text-2xl font-bold">Email Receipt</h2>

        <p className="mb-6 text-sm text-gray-500">
          Enter the customer's email address.
        </p>

        <input
          type="email"
          value={email}
          placeholder="customer@email.com"
          onChange={(e) => setEmail(e.target.value)}
          className="mb-6 w-full rounded-lg border p-3"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-lg border px-4 py-2"
          >
            Cancel
          </button>

          <button
            onClick={() => onSend(email)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Send Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailReceiptModal;
