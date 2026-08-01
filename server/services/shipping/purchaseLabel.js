import shippo from "./shippoClient.js";

export async function purchaseLabel(rateId) {
  const transaction = await shippo.transactions.create({
    rate: rateId,
    async: false,
  });

  return transaction;
}
