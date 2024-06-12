import express from "express";
import {
  createProductType,
  deleteProductType,
  getProductTypes,
  updateProductType,
  upSell,
} from "../controllers/productType.js";

const router = express.Router();
router.get("/", getProductTypes);
router.post("/", createProductType);
router.put("/:id", updateProductType);
router.delete("/:id", deleteProductType);
router.get("/up-sell", upSell);
export default router;
