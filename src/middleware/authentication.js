const jwt = require("jsonwebtoken");

exports.requireSignin = async (req, res, next) => {
  console.log(req.headers);
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    // console.log(user);
  } else {
    console.log("Hii");
    return res.status(400).json({
      message: "Authorization required!",
    });
  }
  next();
};

exports.adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(400).json({
      message: "Access denied!",
    });
  }
  next();
};
exports.userMiddleware = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(400).json({
      message: "Access denied!",
    });
  }
  next();
};
