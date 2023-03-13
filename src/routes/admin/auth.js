const express = require("express");
const { signup, signin, signout } = require("../../controller/admin/auth");
const {
  isRequestValidated,
  validateSignupReq,
  validateSigninReq,
} = require("../../validators/auth");
const { requireSignin } = require("../../middleware/authentication");
const router = express.Router();

router.post("/admin/signin", validateSigninReq, isRequestValidated, signin);
router.post("/admin/signup", validateSignupReq, isRequestValidated, signup);
router.post("/admin/signout", signout);

module.exports = router;
