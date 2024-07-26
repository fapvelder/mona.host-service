import { NotificationModel } from "../models/notification.js";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await NotificationModel.find({}).sort({
      createdAt: -1,
    });
    res.status(200).send(notifications);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
export const createNotification = async (req, res) => {
  try {
    const newNotification = {
      email: req.body.email,
      fullName: req.body.fullName,
    };
    const isInDatabase = await NotificationModel.findOne({
      email: req.body.email,
    });
    if (isInDatabase) {
      return res
        .status(403)
        .send({ message: "Email đã tồn tại trong hệ thống" });
    }
    const notification = new NotificationModel(newNotification);
    await notification.save();
    res.status(200).json(notification);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
