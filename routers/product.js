import express from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
  upSell,
} from "../controllers/product.js";

const router = express.Router();
router.get("/", getProducts);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/up-sell", upSell);
export default router;
