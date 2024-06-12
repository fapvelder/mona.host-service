import express from "express";
import {
  addCrossSell,
  deleteCrossSell,
  getCrossSell,
} from "../controllers/crossSell.js";

const router = express.Router();
router.get("/", getCrossSell);
router.post("/", addCrossSell);
router.delete("/:id", deleteCrossSell);
export default router;
