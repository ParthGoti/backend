const Cart = require("../model/cart");

exports.addToCart = async (req, res) => {
  try {
    const cartExists = await Cart.findOne({ user: req.user._id });
    const cartItem = req.body.cartItems;
    if (cartExists) {
      const item = cartExists.cartItems.find(
        (c) => c.product == cartItem.product
      );
      if (item) {
        const updateCartWithQuantity = await Cart.findOneAndUpdate(
          { user: req.user._id, "cartItems.product": cartItem.product },
          {
            $set: {
              "cartItems.$": {
                ...cartItem,
                quantity: item.quantity + cartItem.quantity,
              },
            },
          },
          { new: true }
        );
        return res.status(200).json({
          message: "Quantity updated successfully!",
          data: updateCartWithQuantity,
        });
      } else {
        const updatedCart = await Cart.findOneAndUpdate(
          { user: req.user._id },
          { $push: { cartItems: cartItem } },
          { new: true }
        );
        return res.status(200).json({
          message: "Cart updated successfully!",
          data: updatedCart,
        });
      }
    } else {
      const newCart = await Cart.create({
        user: req.user._id,
        cartItems: [cartItem],
      });
      return res.status(200).json({
        message: "Item added successfully!",
        data: newCart,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error!",
      error: error.message,
    });
  }
};
