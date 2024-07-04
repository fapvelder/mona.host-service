import express from "express";
import {
  checkCouponClient,
  deleteCoupon,
  generateCoupon,
  getAllCoupons,
  // getCouponByCode,
  updateCoupon,
  validateCoupon,
} from "../controllers/coupon.js";

const router = express.Router();
router.get("/", getAllCoupons);
// router.get("/", getCouponByCode);
router.post("/", generateCoupon);
router.post("/check", checkCouponClient);
router.post("/validate", validateCoupon);
router.post("/use", validateCoupon);
router.put("/:id", updateCoupon);
router.delete("/:id", deleteCoupon);
export default router;
