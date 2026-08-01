import Store from "../models/Store.js";

export const getStore = async (req, res) => {
  let store = await Store.findOne();

  if (!store) {
    store = await Store.create({});
  }

  res.json(store);
};

export const updateStore = async (req, res) => {
  let store = await Store.findOne();

  if (!store) {
    store = await Store.create({});
  }

  Object.assign(store, req.body);

  await store.save();

  res.json(store);
};
