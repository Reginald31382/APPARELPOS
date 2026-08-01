export function formatShippingStatus(status) {
  switch ((status || "").toUpperCase()) {
    case "UNKNOWN":
      return "Label Created";

    case "PRE_TRANSIT":
      return "USPS Awaiting Package";

    case "TRANSIT":
      return "In Transit";

    case "OUT_FOR_DELIVERY":
      return "Out For Delivery";

    case "DELIVERED":
      return "Delivered";

    case "RETURNED":
      return "Returned";

    case "FAILURE":
      return "Delivery Failed";

    default:
      return status || "Pending";
  }
}
