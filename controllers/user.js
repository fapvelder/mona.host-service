import { UserModel } from "../models/user.js";
export const getUser = async (req, res) => {
  try {
    const user = await UserModel.find({}).populate("cart").lean();
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
export const createUser = async (req, res, next) => {
  try {
    const newUser = {
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
    };
    const user = new UserModel(newUser);
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
