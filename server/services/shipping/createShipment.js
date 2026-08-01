import shippo from "./shippoClient.js";

export async function createShipment({ fromAddress, toAddress, parcel }) {
  const shipment = await shippo.shipments.create({
    addressFrom: fromAddress,
    addressTo: toAddress,
    parcels: [parcel],
    async: false,
  });

  return shipment;
}
