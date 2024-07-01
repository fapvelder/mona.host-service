import mongoose from "mongoose";

const crossSellSchema = new mongoose.Schema(
  {
    option: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    crossSellOption: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    isUpSell: {
      type: Boolean,
    },
    discount: {
      type: Number,
    },
  },
  { timestamps: true }
);
export const CrossSellModel = mongoose.model("CrossSell", crossSellSchema);
