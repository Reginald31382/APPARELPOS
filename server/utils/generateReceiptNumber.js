import Counter from "../models/Counter.js";

export default async function generateReceiptNumber() {
  const counter = await Counter.findOneAndUpdate(
    {
      name: "receipt",
    },
    {
      $inc: {
        sequence: 1,
      },
    },
    {
      upsert: true,
      returnDocument: "after",
    },
  );

  return `RC-${counter.sequence}`;
}
