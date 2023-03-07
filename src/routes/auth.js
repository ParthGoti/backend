const express = require("express");
const { signup, signin } = require("../controller/auth");
const { requireSignin } = require("../middleware/authentication");
const router = express.Router();
const {
  validateSignupReq,
  isRequestValidated,
  validateSigninReq,
} = require("../validators/auth");

router.post("/signin", validateSigninReq, isRequestValidated, signin);
router.post("/signup", validateSignupReq, isRequestValidated, signup);
// router.post("/profile", requireSignin, (req, res) => {
//   res.status(200).json({
//     user: "profile",
//   });
// });

module.exports = router;
