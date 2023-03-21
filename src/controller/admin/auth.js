const User = require("../../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const shortid = require("shortid");

exports.signup = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  try {
    const userdata = await User.findOne({ email: email });

    const hash_password = await bcrypt.hash(password, 10);
    if (userdata) {
      return res.status(400).json({
        message: `Admin already exist!`,
      });
    } else {
      const _user = await User.create({
        firstname,
        lastname,
        email,
        hash_password,
        username: shortid.generate(),
        role: "admin",
      });

      if (_user) {
        return res.status(200).json({
          message: "Admin created successfully!",
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
    if (userdata) {
      if ( await userdata.authenticate(password) && userdata.role === "admin") {
        const token = jwt.sign(
          { _id: userdata._id, role: userdata.role },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d",
          }
        );
        const { _id, firstname, lastname, email, role, fullname } = userdata;
        res.cookie("token", token, { expiresIn: "1d" });
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
          message: "Invalid password!",
        });
      }
    } else {
      return res.status(400).json({
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

exports.signout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "signout successfully...!",
  });
};
