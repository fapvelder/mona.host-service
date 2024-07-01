import express from "express";
import {
  deleteCoupon,
  generateCoupon,
  getAllCoupons,
  updateCoupon,
  validateCoupon,
} from "../controllers/coupon.js";

const router = express.Router();
router.get("/", getAllCoupons);
router.post("/", generateCoupon);
router.post("/validate", validateCoupon);
router.post("/use", validateCoupon);
router.put("/:id", updateCoupon);
router.delete("/:id", deleteCoupon);
export default router;
