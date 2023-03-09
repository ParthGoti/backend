const express = require("express");
const dotenv = require("dotenv");
const app = express();
const bodyparser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const authRoutes = require("./src/routes/auth");
const adminRoutes = require("./src/routes/admin/auth");
const categoryRoutes = require("./src/routes/category");
const productRoutes = require("./src/routes/product");
const cartRoutes = require("./src/routes/cart");
const cors = require("cors");

dotenv.config();

const port = process.env.PORT;
const MONGO_DB_USER = process.env.MONGO_DB_USER;
const MONGO_DB_PASSWORD = process.env.MONGO_DB_PASSWORD;
const MONGO_DB_DATABASE = process.env.MONGO_DB_DATABASE;

app.use(bodyparser.json({ extended: true }));
app.use(bodyparser.urlencoded({ extended: false }));
app.use("/public", express.static(path.join(__dirname, "src/uploads")));

// database connection
mongoose
.connect(
  `mongodb+srv://${MONGO_DB_USER}:${MONGO_DB_PASSWORD}@cluster0.oyja1ys.mongodb.net/${MONGO_DB_DATABASE}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
  )
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log("Database not connected", err);
  });
  
app.use(cors());
app.use("/api", authRoutes);
app.use("/api", adminRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello server",
  });
});

app.post("/data", (req, res) => {
  res.status(200).json({
    message: req.body,
  });
});

app.listen(port, () => {
  console.log(`server is running on port : ${port}`);
});
