import mongoose from "mongoose";

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
    specificProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: () => {
          return this.applyFor === "specific";
        },
      },
    ],
    allowedEmails: {
      type: [String],
      default: [],
    },
    requiredProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

export const CouponModel = mongoose.model("Coupon", couponSchema);
