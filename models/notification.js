import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: { type: String, required: true },
  },
  { timestamps: true }
);
export const NotificationModel = mongoose.model(
  "Notification",
  notificationSchema
);
