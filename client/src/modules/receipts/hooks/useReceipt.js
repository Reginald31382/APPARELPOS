import { useQuery } from "@tanstack/react-query";
import { fetchReceipt } from "../services/receiptService";

const useReceipt = (id) =>
  useQuery({
    queryKey: ["receipt", id],
    queryFn: () => fetchReceipt(id),
    enabled: !!id,
  });

export default useReceipt;
