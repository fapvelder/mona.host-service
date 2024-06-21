import mongoose from "mongoose";

const productTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const ProductTypeModel = mongoose.model(
  "ProductType",
  productTypeSchema
);
