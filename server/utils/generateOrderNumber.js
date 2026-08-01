import Counter from "../models/Counter.js";

const PREFIX = "JR-";
const START_SEQUENCE = 100000;

const generateOrderNumber = async () => {
  let counter = await Counter.findOne({ name: "orders" });

  if (!counter) {
    counter = await Counter.create({
      name: "orders",
      sequence: START_SEQUENCE,
    });
  }

  counter.sequence += 1;
  await counter.save();

  return `${PREFIX}${counter.sequence}`;
};

export default generateOrderNumber;
