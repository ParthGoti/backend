const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");

const generateJwtToken = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

exports.signup = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  try {
    const userdata = await User.findOne({ email: email });
    const hash_password = await bcrypt.hash(password, 10);
    if (userdata) {
      return res.status(400).json({
        message: `user already exist with ${email}`,
      });
    } else {
      const user = await User.create({
        firstname,
        lastname,
        email,
        hash_password,
        username: shortid.generate(),
      });

      if (user) {
        console.log("user", user);
        const token = generateJwtToken(user._id, user.role);
        const { _id, firstname, lastname, email, role, fullname } = user;
        return res.status(200).json({
          token,          
          user: { _id, firstname, lastname, email, role, fullname },
        });
      } else {
        return res.status(400).json({
          message: "Something went wrong!",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error!",
    });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userdata = await User.findOne({ email: email });
    console.log(userdata);
    if (userdata) {
      const isPassword = await userdata.authenticate(password);
      console.log(isPassword);
      if (isPassword && userdata.role === "user") {
        const token = generateJwtToken(userdata._id, userdata.role);
        const { _id, firstname, lastname, email, role, fullname } = userdata;
        res.status(200).json({
          token,
          user: {
            _id,
            firstname,
            lastname,
            email,
            role,
            fullname,
          },
        });
      } else {
        return await res.status(400).json({
          message: "Something Went Wrong",
        });
      }
    } else {
      return res.status(203).json({
        message: "user not registered please login first",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};
