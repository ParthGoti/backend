const express = require("express");
const { requireSignin, adminMiddleware } = require("../../middleware/authentication");
const {
  updateOrder,
  getCustomerOrders,
} = require("../../controller/admin/order");
const router = express.Router();

router.post(`/order/update`, requireSignin, adminMiddleware, updateOrder);
router.post(
  `/order/getCustomerOrders`,
  requireSignin,
  adminMiddleware,
  getCustomerOrders
);

module.exports = router;