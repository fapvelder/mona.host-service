import express from "express";
import {
  createPackageProduct,
  createProduct,
  deleteProduct,
  duplicateProduct,
  getProductById,
  getProducts,
  getVPS,
  updateProduct,
  upSell,
} from "../controllers/product.js";

const router = express.Router();
router.get("/", getProducts);
router.get("/vps", getVPS);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.post("/:id/variant", createPackageProduct);
router.post("/duplicate/:id", duplicateProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/up-sell", upSell);
// router.get("/up-sell/", getSameProducts);
export default router;
