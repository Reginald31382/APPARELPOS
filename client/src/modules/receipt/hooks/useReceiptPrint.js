import { useReactToPrint } from "react-to-print";

const useReceiptPrint = (receiptRef) => {
  const printReceipt = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: "J.Rome Receipt",
  });

  return {
    printReceipt,
  };
};

export default useReceiptPrint;
