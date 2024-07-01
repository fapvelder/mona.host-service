import { CouponModel } from "../models/coupon.js";
import { ProductModel } from "../models/product.js";

export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await CouponModel.find({})
      .sort({ createdAt: -1 })
      .populate("specificProducts")
      .populate("requiredProducts");
    res.status(200).send(coupons);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
export const generateCoupon = async (req, res) => {
  try {
    const { data } = req.body;
    const coupon = new CouponModel(data);
    await coupon.save();
    res.status(200).send(coupon);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
function checkProducts(products, requiredProducts) {
  const productIds = products?.map((product) => product);
  return requiredProducts?.every((productId) =>
    productIds?.includes(productId.toString())
  );
}

export const validateCoupon = async (req, res) => {
  try {
    const { code, products, totalPrice, userEmail } = req.body;
    const useCoupon = req.originalUrl;
    const coupon = await CouponModel.findOne({ code: code });

    const currentDate = new Date();
    const expireDate = new Date(coupon.expireDate);
    const hasRequiredProducts = checkProducts(
      products,
      coupon.requiredProducts
    );
    const hasSpecificProducts = checkProducts(
      products,
      coupon.specificProducts
    );
    console.log(hasRequiredProducts, hasSpecificProducts);
    if (!coupon) res.status(404).send({ message: "The coupon is not exist" });
    if (expireDate < currentDate)
      return res.status(410).send({ message: `The coupon has expired` });
    if (coupon.totalUsageLimit === 0)
      return res
        .status(403)
        .send({ message: "The coupon has exceeded the limit" });
    if (coupon.userUsageLimit === 0)
      return res
        .status(403)
        .send({ message: "User have reached the limit for using this coupon" });
    if (coupon.minTotalPrice > totalPrice) {
      const remain = coupon.minTotalPrice - totalPrice;
      return res.status(400).send({
        money: remain,
        message: `You need to buy more ${remain}VNĐ to apply the coupon`,
      });
    }
    if (
      coupon.allowedEmails.length > 0 &&
      !coupon.allowedEmails.includes(userEmail)
    )
      return res
        .status(403)
        .send({ message: "You are not allowed to use this coupon" });
    if (coupon.applyFor === "specific" && !hasSpecificProducts)
      return res
        .status(403)
        .send({ message: "The coupon just apply for some specific products" });
    if (!hasRequiredProducts)
      return res
        .status(403)
        .send({ message: "The coupon just apply for some required products" });
    if (useCoupon === "/coupon/use") {
      coupon.totalUsageLimit -= 1;
      await coupon.save();
    }
    return res
      .status(200)
      .send({ message: "You can use the coupon", coupon: coupon });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.body;
    const updatedCoupon = await CouponModel.findByIdAndUpdate(
      id,
      {
        ...data,
      },
      { new: true }
    );

    res.status(200).json(updatedCoupon);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCoupon = await CouponModel.findByIdAndDelete(id);
    if (!deletedCoupon) {
      return res.status(404).send({ message: "Coupons not found" });
    }
    res.status(200).json(deletedCoupon);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
