const app = require("express");
const { addToCart } = require("../controller/cart");
const router = app.Router();
const {
  requireSignin,
  userMiddleware,
} = require("../middleware/authentication");

router.post("/user/cart/addtocart", requireSignin, userMiddleware, addToCart);

module.exports = router;
