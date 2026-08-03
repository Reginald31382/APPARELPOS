import shippo from "./shippoClient.js";

export async function createShipment({ fromAddress, toAddress, parcel }) {
  try {
    return await shippo.shipments.create({
      addressFrom: fromAddress,
      addressTo: toAddress,
      parcels: [parcel],
      async: false,
    });
  } catch (err) {
    console.error("Shippo shipment error:");
    console.dir(err, { depth: null });
    throw err;
  }
}
