const ReceiptHeader = ({ receipt }) => {
  return (
    <div className="border-b pb-6 text-center">
      <h1 className="text-3xl font-bold">J.Rome Apparel</h1>

      <p className="text-gray-500">Premium Streetwear</p>

      <div className="mt-6 space-y-1 text-sm text-gray-600">
        <p>
          <span className="font-semibold">Receipt #</span> {receipt.orderNumber}
        </p>

        <p>{new Date(receipt.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default ReceiptHeader;
