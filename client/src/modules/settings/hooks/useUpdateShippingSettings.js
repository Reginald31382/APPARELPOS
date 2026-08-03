import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateShippingSettings } from "../services/shippingSettingsService";

export default function useUpdateShippingSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateShippingSettings,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["shipping-settings"],
      });
    },
  });
}
