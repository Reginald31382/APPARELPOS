import { useState } from "react";

import useReceiptStore from "../../store/receipt/useReceiptStore";

import EmailReceiptModal from "./EmailReceiptModal";

import useEmailReceipt from "./hooks/useEmailReceipt";

import buildReceiptEmail from "./utils/buildReceiptEmail";

const EmailReceiptButton = () => {
  const receipt = useReceiptStore((state) => state.receipt);

  const { sendReceipt } = useEmailReceipt();

  const [open, setOpen] = useState(false);

  if (!receipt) return null;

  const handleSend = async (email) => {
    const template = buildReceiptEmail(receipt, email);

    await sendReceipt(template);

    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-lg bg-emerald-600 py-3 text-white hover:bg-emerald-700"
      >
        Email Receipt
      </button>

      <EmailReceiptModal
        open={open}
        onOpenChange={setOpen}
        defaultEmail={receipt.customer?.email || ""}
        onSend={handleSend}
      />
    </>
  );
};

export default EmailReceiptButton;
