import mongoose from "mongoose";

const crossSellSchema = new mongoose.Schema(
  {
    option: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProductOption" }],
    crossSellOption: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductOption",
      },
    ],
  },
  { timestamps: true }
);
export const CrossSellModel = mongoose.model("CrossSell", crossSellSchema);
