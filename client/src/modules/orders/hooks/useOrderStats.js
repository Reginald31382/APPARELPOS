import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import socket from "../../../services/socketService";
import { fetchOrderStats } from "../services/orderService";

export default function useOrderStats() {
  const queryClient = useQueryClient();

  useEffect(() => {
    socket.connect();

    const refresh = () => {
      queryClient.invalidateQueries({
        queryKey: ["order-stats"],
      });
    };

    socket.on("order:new", refresh);

    return () => {
      socket.off("order:new", refresh);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ["order-stats"],
    queryFn: fetchOrderStats,
  });
}
