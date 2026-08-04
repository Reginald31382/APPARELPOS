import shippo from "./shippoClient.js";

export async function purchaseLabel(rateId) {
  try {
    const transaction = await shippo.transactions.create({
      rate: rateId,
      async: false,
    });

    // console.log("📦 Shippo Transaction:");
    // console.dir(transaction, { depth: null });

    return transaction;
  } catch (err) {
    // console.error("❌ Shippo Transaction Error");

    if (err.response?.data) {
      console.dir(err.response.data, { depth: null });
    } else {
      console.dir(err, { depth: null });
    }

    throw err;
  }
}
