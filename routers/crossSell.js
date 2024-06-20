import express from "express";
import {
  addCrossSell,
  deleteCrossSell,
  getCrossSell,
  updateCrossSell,
} from "../controllers/crossSell.js";

const router = express.Router();
router.get("/", getCrossSell);
router.post("/", addCrossSell);
router.put("/:id", updateCrossSell);
router.delete("/:id", deleteCrossSell);
export default router;
