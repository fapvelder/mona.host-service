import express from "express";
import {
  calculateTotalPrice,
  createOrder,
  createPackageProduct,
  createProduct,
  deleteProduct,
  duplicateProduct,
  getProductById,
  getProducts,
  getProductsByIds,
  getProductsWithAdditionalFields,
  getVPS,
  updateProduct,
  upSell,
} from "../controllers/product.js";

const router = express.Router();
router.get("/", getProducts);
router.get("/vps", getVPS);
router.get("/:id", getProductById);
router.post("/create-order", createOrder);
router.post("/get-products-by-ids", getProductsByIds);
router.post("/get-price-products-by-ids", getProductsWithAdditionalFields);
router.post("/", createProduct);
router.post("/:id/variant", createPackageProduct);
router.post("/duplicate/:id", duplicateProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/up-sell", upSell);
router.post("/calculate", calculateTotalPrice);
// router.get("/up-sell/", getSameProducts);
export default router;
