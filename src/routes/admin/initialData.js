const express = require("express");
const { initialData } = require("../../controller/admin/initialData");
const {
  requireSignin,
  adminMiddleware,
} = require("../../middleware/authentication");
const router = express.Router();

router.get("/initialdata", requireSignin, adminMiddleware, initialData);

module.exports = router;
