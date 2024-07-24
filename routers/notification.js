import express from "express";
import {
  createNotification,
  getNotifications,
} from "../controllers/notification.js";

const router = express.Router();
router.get("/", getNotifications);
router.post("/", createNotification);

export default router;
