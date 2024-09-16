import express from "express";
import {
  checkAvailableDomains,
  checkWhoIs,
  generateDomains,
  getListDomains,
} from "../controllers/domain.js";

const router = express.Router();
router.get("/", getListDomains);
router.get("/check", checkAvailableDomains);
router.get("/whois", checkWhoIs);
router.post("/", generateDomains);
export default router;
