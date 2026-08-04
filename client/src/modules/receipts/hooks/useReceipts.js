import { useQuery } from "@tanstack/react-query";
import { fetchReceipts } from "../services/receiptService";

const useReceipts = () =>
  useQuery({
    queryKey: ["receipts"],
    queryFn: fetchReceipts,
  });

export default useReceipts;
