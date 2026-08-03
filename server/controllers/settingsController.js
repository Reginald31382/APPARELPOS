import Settings from "../models/Settings.js";

export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateSettings = async (req, res) => {
  try {
    console.log("Incoming settings:");
    console.dir(req.body, { depth: null });
    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings();
    }

    // Merge all top-level fields
    Object.assign(settings, req.body);

    // Merge nested shipping settings safely
    if (req.body.shipping) {
      settings.shipping = {
        ...settings.shipping.toObject(),
        ...req.body.shipping,
      };
    }

    await settings.save();

    res.json(settings);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
