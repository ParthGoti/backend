const User = require("../../model/user");
const jwt = require("jsonwebtoken");
const user = require("../../model/user");

exports.signup = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  try {
    const userdata = await User.findOne({ email: email });

    if (userdata) {
      return res.status(400).json({
        message: `Admin already exist!`,
      });
    } else {
      const _user = await User.create({
        firstname,
        lastname,
        email,
        password,
        username: Math.random().toString(),
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
      if (userdata.authenticate(password) && userdata.role === "admin") {
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