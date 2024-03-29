const express = require("express");
const { createPage, getPage } = require("../../controller/admin/page");
const {
  upload,
  requireSignin,
  adminMiddleware,
} = require("../../middleware/authentication");
const router = express.Router();

router.post(
  "/page/create",
  requireSignin,
  adminMiddleware,
  upload.fields([{ name: "banners" }, { name: "products" }]),
  createPage
);
router.get("/page/:category/:type", getPage);
module.exports = router;
