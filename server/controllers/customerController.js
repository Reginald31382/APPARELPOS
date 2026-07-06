import Customer from "../models/Customer.js";

export const getCustomers = async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        {
          firstName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          lastName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          phone: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const customers = await Customer.find(query).sort({
      firstName: 1,
    });

    res.json(customers);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);

    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
