const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");

exports.signup = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  try {
    const userdata = await User.findOne({ email: email });
    const hash_password = await bcrypt.hash(password,10);
    if (userdata) {
      return res.status(400).json({
        message: `user already exist with ${email}`,
      });
    } else {
      const _user = await User.create({
        firstname,
        lastname,
        email,
        hash_password,
        username: shortid.generate(),
      });

      if (_user) {
        console.log("user", _user);
        return res.status(200).json({
          message: "user created successfully!",
          data: _user,
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
      if (userdata.authenticate(password)) {
        const token = jwt.sign(
          { _id: userdata._id, role: userdata.role },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );
        const { _id, firstname, lastname, email, role, fullname } = userdata;
        res.status(200).json({
          token,
          User: {
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
