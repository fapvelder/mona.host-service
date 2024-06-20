import mongoose from "mongoose";

const crossSellSchema = new mongoose.Schema(
  {
    option: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProductType" }],
    crossSellOption: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductType",
      },
    ],
  },
  { timestamps: true }
);
export const CrossSellModel = mongoose.model("CrossSell", crossSellSchema);
