const UserAddress = require("../model/address");

exports.addAddress = async (req, res) => {
  try {
    //return res.status(200).json({body: req.body})
    const { payload } = req.body;
    if (!payload.address) {
      throw new Error("Params address required");
    }

    if (payload.address._id) {
      const address = await UserAddress.findOneAndUpdate(
        { user: req.user._id, "address._id": payload.address._id },
        {
          $set: {
            "address.$": payload.address,
          },
        },
        { new: true, upsert: false }
      );
      if (!address) {
        throw new Error("Address not found");
      }
      res.status(201).json({ address });
    } else {
      const address = await UserAddress.findOneAndUpdate(
        { user: req.user._id },
        {
          $push: {
            address: payload.address,
          },
        },
        { new: true, upsert: true }
      );
      if (!address) {
        throw new Error("Failed to create address");
      }
      res.status(201).json({ address });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.getAddress = async (req, res) => {
  const userAddress = await UserAddress.findOne({ user: req.user._id });
  if (userAddress) {
    return res.status(200).json({
      userAddress,
    });
  } else {
    return res.status(400).json({
      error: "soemething went wrong!",
    });
  }
};
