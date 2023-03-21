const Order = require("../../model/order");

exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.updateOne(
      { _id: req.body.orderId, "orderStatus.type": req.body.type },
      {
        $set: {
          "orderStatus.$": [
            { type: req.body.type, date: new Date(), isCompleted: true },
          ],
        },
      }
      );
      // console.log(req.body);
    // console.log(order);
    return res.status(200).json({ order });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

exports.getCustomerOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("items.productId", "name");
    // console.log("orders",orders);
    return res.status(200).json({ orders });
  } catch (error) {
   return res.status(400).json({ error });
  }
};
