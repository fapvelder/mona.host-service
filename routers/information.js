import express from "express";
import {
  getCities,
  getDistricts,
  getWards,
} from "../controllers/information.js";

const router = express.Router();
router.get("/cities", getCities);
router.get("/districts", getDistricts);
router.get("/wards", getWards);

export default router;
