import shippo from "./shippoClient.js";

export async function purchaseLabel(rateId) {
  try {
    return await shippo.transactions.create({
      rate: rateId,
      async: false,
    });
  } catch (err) {
    console.error("Shippo transaction error:");
    console.dir(err, { depth: null });
    throw err;
  }
}
