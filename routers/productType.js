import express from "express";
import {
  createProductType,
  deleteProductType,
  getProductTypeById,
  getProductTypes,
  updateProductType,
} from "../controllers/productType.js";

const router = express.Router();
router.get("/", getProductTypes);
router.get("/:id", getProductTypeById);
router.post("/", createProductType);
router.put("/:id", updateProductType);
router.delete("/:id", deleteProductType);
export default router;
