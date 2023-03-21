const Order = require("../model/order");
const Cart = require("../model/cart");
const Address = require("../model/address");

exports.addOrder = async (req, res) => {
  try {
    const deleteitem = await Cart.deleteOne({ user: req.user._id });
    // console.log(req.user._id);
    // console.log(deleteitem);
    if (deleteitem) {
      req.body.user = req.user._id;
      req.body.orderStatus = [
        {
          type: "ordered",
          date: new Date(),
          isCompleted: true,
        },
        {
          type: "packed",
          isCompleted: false,
        },
        {
          type: "shipped",
          isCompleted: false,
        },
        {
          type: "delivered",
          isCompleted: false,
        },
      ];
      const order = await Order.create(req.body);
      if (!order) {
        throw new Error("Order not created");
      }
      return res.status(200).json({ order });
    } else {
      throw new Error("Something went wrong");
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .select("_id paymentStatus items")
      .populate("items.productId", "_id name productPictures");

    if (!orders) {
      throw new Error("No orders found");
    }

    res.status(200).json({ orders });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.body.orderId })
      .populate("items.productId", "_id name productPictures")
      .lean();

    if (order) {
      const address = await Address.findOne({
        user: req.user._id,
      });

      order.address = address.address.find(
        (adr) => adr._id.toString() == order.addressId.toString()
      );

      res.status(200).json({
        order,
      });
    } else {
      return res.status(400).json({ error: "Order not found" });
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
};
