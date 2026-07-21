import QRCode from "react-qr-code";

const ReceiptQRCode = ({ value }) => {
  return (
    <div className="mt-8 flex flex-col items-center">
      <QRCode value={value} size={90} level="H" />

      <p className="mt-2 text-center text-[10px] text-gray-500">
        Scan to shop online
      </p>

      <p className="text-[10px] text-gray-400">www.jrome-studios.com</p>
    </div>
  );
};

export default ReceiptQRCode;
