const Cart = require("../model/cart");

function runUpdate(condition, updateData) {
  return new Promise((resolve, reject) => {
    //you update code here

    Cart.findOneAndUpdate(condition, updateData, { upsert: true })
      .then((result) => resolve())
      .catch((err) => reject(err));
  });
}

exports.addItemToCart = (req, res) => {
  Cart.findOne({ user: req.user._id })
    .then((cart) => {
      if (cart) {
        //if cart already exists then update cart by quantity
        let promiseArray = [];

        req.body.cartItems.forEach((cartItem) => {
           console.log("cartItems:",cartItem)
          const product = cartItem.product;
          const item = cart.cartItems.find((c) => c.product == product);
          let condition, update;
          if (item) {
            condition = { user: req.user._id, "cartItems.product": product };
            update = {
              $set: {
                "cartItems.$": cartItem,
              },
            };
          } else {
            condition = { user: req.user._id };
            update = {
              $push: {
                cartItems: cartItem,
              },
            };
          }
          promiseArray.push(runUpdate(condition, update));
        });
        Promise.all(promiseArray)
          .then((response) => res.status(201).json({ response }))
          .catch((error) => res.status(400).json({ error }));
      } else {
        //if cart not exist then create a new cart
        const cart = new Cart({
          user: req.user._id,
          cartItems: req.body.cartItems,
        });
        cart
          .save()
          .then((cart) => {
            return res.status(201).json({ cart });
          })
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.getCartItems = async (req, res) => {
  //const { user } = req.body.payload;
  //if(user){
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "cartItems.product",
    "_id name price productPictures"
  );
  // console.log(cart);
  if (cart) {
    let cartItems = {};
    cart.cartItems.forEach((item, index) => {
      // console.log(item);
      cartItems[item.product._id.toString()] = {
        _id: item.product._id.toString(),
        name: item.product.name,
        img: item.product.productPictures[0].img,
        price: item.product.price,
        qty: item.quantity,
      };
    });
    res.status(200).json({ cartItems });
  } else {
    res.status(400).json({
      error: "something went wrong",
    });
  }
};

exports.removeCartItems = async (req, res) => {
  try {
    const { productId } = req.body.payload;
    if (productId) {
      const result = await Cart.updateOne(
        { user: req.user._id },
        {
          $pull: {
            cartItems: {
              product: productId,
            },
          },
        }
      );
      if (result) {
        return res.status(200).json({ result });
      }
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
};

