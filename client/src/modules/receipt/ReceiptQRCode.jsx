import QRCode from "react-qr-code";

const ReceiptQRCode = ({ value = "https://www.jrome-studios.com" }) => {
  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      <QRCode value={value} size={110} level="M" />

      <p className="text-center text-xs text-gray-500">
        Scan to shop our latest arrivals
      </p>
    </div>
  );
};

export default ReceiptQRCode;
