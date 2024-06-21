import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductType",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    optimizeDescription: {
      type: String,
    },
    renewalCostDescription: {
      type: String,
    },
    bonusPeriod: {
      type: String,
    },
    salePrice: {
      type: Number,
    },
    basePrice: {
      type: Number,
    },
    pricePerMonth: {
      type: Number,
    },
    period: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
    },
    bestChoice: {
      type: Boolean,
      default: false,
    },
    popular: {
      type: Boolean,
      default: false,
    },
    information: {
      feature_tooltip: { type: String },
      features: [
        {
          description: {
            type: String,
          },
          tooltip: {
            type: String,
          },
        },
      ],
      securities: [
        {
          description: {
            type: String,
          },
          tooltip: {
            type: String,
          },
        },
      ],
      services: [
        {
          description: {
            type: String,
          },
          tooltip: {
            type: String,
          },
        },
      ],
      specifications: [
        {
          description: {
            type: String,
          },
          tooltip: {
            type: String,
          },
        },
      ],
    },
  },
  { timestamps: true }
);

export const ProductModel = mongoose.model("Product", productSchema);
