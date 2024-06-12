import mongoose from "mongoose";

const productTypeSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    optionName: {
      type: String,
      required: true,
    },
    optionPrice: {
      type: Number,
    },
    basePrice: {
      type: Number,
    },
    period: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
    },
    upSell: {
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

export const ProductTypeModel = mongoose.model(
  "ProductType",
  productTypeSchema
);
