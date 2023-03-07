const { check, validationResult } = require("express-validator");

exports.validateSignupReq = [
  check("firstname").notEmpty().withMessage("firstname is required"),
  check("lastname").notEmpty().withMessage("lastname is required"),
  check("email").isEmail().withMessage("email is not valid"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 charater long"),
];

exports.validateSigninReq = [
    check("email").isEmail().withMessage("email is not valid"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 charater long"),
  ];

exports.isRequestValidated = (req,res,next)=>{
  const errors = validationResult(req).array();
  if (errors.length > 0) {
    return res.status(400).json({
        error:errors[0].msg
    })
  }
  next();
}
