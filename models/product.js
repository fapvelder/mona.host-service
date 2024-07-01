import mongoose from "mongoose";

const requiredProductSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    packageName: {
      type: String,
      required: false,
    },
    period: {
      type: Number,
      required: false,
    },
  },
  { _id: false }
);
const crossSellProductSchema = new mongoose.Schema(
  {
    ...requiredProductSchema.obj,
    discountCrossSell: {
      type: Number,
      required: false,
    },
  },
  { _id: false }
);
const crossSellSchema = new mongoose.Schema(
  {
    requiredProduct: {
      type: [requiredProductSchema],
      required: false,
    },
    crossSellProduct: {
      type: [crossSellProductSchema],
      required: true,
    },
  },
  { _id: false }
);

const periodSchema = new mongoose.Schema({
  optimizeDescription: {
    type: String,
  },
  renewalCostDescription: {
    type: String,
  },
  bonusPeriod: {
    type: String,
  },
  months: {
    type: Number,
    required: true,
  },
  salePrice: {
    type: Number,
  },
  basePrice: {
    type: Number,
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
});
const packagesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
    period: [periodSchema],
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    productType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductType",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    os: {
      type: String,
      enum: ["Window", "Linux"],
    },
    packages: [packagesSchema],
    crossSells: [crossSellSchema],
  },
  { timestamps: true }
);

export const ProductModel = mongoose.model("Product", productSchema);
