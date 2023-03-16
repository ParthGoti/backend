const app = require("express");
const {
  addProduct,
  getProductBySlug,
  getProductDetailsById,
} = require("../controller/product");
const router = app.Router();
const {
  adminMiddleware,
  requireSignin,
} = require("../middleware/authentication");
const multer = require("multer");
const shortid = require("shortid");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.post(
  "/product/create",
  requireSignin,
  adminMiddleware,
  upload.array("productImg"),
  addProduct
);

router.get("/products/:slug", getProductBySlug);
router.get("/product/:productId", getProductDetailsById);

module.exports = router;
