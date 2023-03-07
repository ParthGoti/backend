const express = require("express");
const { signup, signin } = require("../../controller/admin/auth");
const {
  isRequestValidated,
  validateSignupReq,
  validateSigninReq,
} = require("../../validators/auth");
const router = express.Router();

router.post("/admin/signin", validateSigninReq, isRequestValidated, signin);
router.post("/admin/signup",validateSignupReq,isRequestValidated, signup);

module.exports = router;
