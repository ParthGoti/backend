const app = require("express");
const { getCartItems, addItemToCart, removeCartItems } = require("../controller/cart");
const router = app.Router();
const {
  requireSignin,
  userMiddleware,
} = require("../middleware/authentication");

router.post("/user/cart/addtocart", requireSignin, userMiddleware, addItemToCart);

router.get("/user/cart/getitems", requireSignin, userMiddleware, getCartItems);
router.post(
  "/user/cart/removeItem",
  requireSignin,
  userMiddleware,
  removeCartItems
);

module.exports = router;
