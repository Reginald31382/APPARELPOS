const useReceiptPrint = () => {
  const printReceipt = () => {
    window.print();
  };

  return {
    printReceipt,
  };
};

export default useReceiptPrint;
