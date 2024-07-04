import mongoose from "mongoose";
import { requiredProductSchema } from "./product.js";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["fixed", "percentage"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    applyFor: {
      type: String,
      enum: ["specific", "all"],
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    maxDiscount: {
      Number,
    },
    minTotalPrice: {
      type: Number,
      default: 0,
    },
    expireDate: {
      type: Date,
    },
    totalUsageLimit: {
      type: Number,
      required: true,
    },
    userUsageLimit: {
      type: Number,
    },
    specificProducts: [requiredProductSchema],
    allowedEmails: {
      type: [String],
      default: [],
    },
    isForAll: {
      type: Boolean,
      default: false,
    },
    requiredProducts: [requiredProductSchema],
  },
  { timestamps: true }
);

export const CouponModel = mongoose.model("Coupon", couponSchema);
