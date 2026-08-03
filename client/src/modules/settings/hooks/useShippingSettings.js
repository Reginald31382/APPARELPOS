import { useQuery } from "@tanstack/react-query";
import { getShippingSettings } from "../services/shippingSettingsService";

export default function useShippingSettings() {
  return useQuery({
    queryKey: ["shipping-settings"],
    queryFn: getShippingSettings,
  });
}
