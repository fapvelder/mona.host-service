import { CouponModel } from "../models/coupon.js";
import { ProductModel } from "../models/product.js";

export const getAllCoupons = async (req, res) => {
  try {
    const { code } = req.query;
    const coupons = code
      ? await CouponModel.findOne({ code: code })
      : await CouponModel.find({})
          .sort({ createdAt: -1 })
          .populate("specificProducts")
          .populate("requiredProducts");
    if (!coupons)
      return res.status(404).send({ message: "Mã khuyến mãi không tồn tại" });

    return res.status(200).send(coupons);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
// export const getCouponByCode = async (req, res) => {
//   try {
//     console.log(code);
//     const coupon = await CouponModel.findOne({ code: code });
//     if (!coupon)
//       return res.status(404).send({ message: "Mã khuyến mãi không tồn tại" });
//     return res.status(200).send(coupon);
//   } catch (err) {
//     res.status(500).send({ message: err.message });
//   }
// };
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
// function checkProducts(products, requiredProducts) {
//   const productIds = products?.map((product) => product.id);
//   const productPackages = products?.map((product) => product.packageName);
//   const productPeriod = products?.map((product) => product.period);
//   console.log(products);
//   console.log(requiredProducts);
//   return requiredProducts?.some((product) => console.log(productIds));
// }
function hasAllRequiredProducts(required, current) {
  for (const requiredProduct of required) {
    const found = current.some(
      (currentProduct) =>
        currentProduct.id === requiredProduct.product.toString() &&
        currentProduct.packageName === requiredProduct.packageName &&
        currentProduct.period === requiredProduct.period
    );
    if (!found) {
      return false;
    }
  }
  return true;
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
export const checkCoupon = async (req, res, code, products, totalPrice) => {
  try {
    const coupon = await CouponModel.findOne({ code: code });
    if (!coupon) return { message: "The coupon is not exist", status: "00" };

    const currentDate = new Date();
    const expireDate = new Date(coupon.expireDate);
    const hasRequiredProducts = hasAllRequiredProducts(
      coupon.requiredProducts,
      products
    );
    const hasSpecificProducts = hasAllRequiredProducts(
      coupon.specificProducts,
      products
    );
    console.log("hasRequiredProducts", hasRequiredProducts);
    if (expireDate < currentDate)
      return { message: `Mã khuyến mãi đã hết hạn`, status: "00" };
    if (coupon.totalUsageLimit === 0)
      return { message: "Mã khuyến mãi đã dùng hết", status: "00" };
    if (coupon.userUsageLimit === 0)
      return {
        message: "Người dùng đã dùng mã khuyến mãi",
        status: "00",
      };
    if (coupon.minTotalPrice > totalPrice) {
      const remain = coupon.minTotalPrice - totalPrice;
      return {
        money: remain,
        message: `Bạn cần mua thêm ${remain.toLocaleString(
          "vi-VN"
        )} VNĐ để áp dụng mã khuyến mãi`,
        status: "00",
      };
    }
    // if (
    //   coupon.allowedEmails.length > 0 &&
    //   !coupon.allowedEmails.includes(userEmail)
    // )
    //   return { message: "You are not allowed to use this coupon" };
    if (coupon.applyFor === "specific" && !hasSpecificProducts)
      return {
        message: "Mã khuyến mãi chỉ áp dụng cho một số sản phẩm",
        status: "00",
      };
    if (!hasRequiredProducts)
      return {
        message: "Mã khuyến mãi chỉ áp dụng cho một số sản phẩm",
        status: "00",
      };
    return {
      message: "Bạn có thể sử dụng mã khuyến mãi",
      coupon,
      status: "01",
    };
  } catch (err) {
    console.log(err.message);
    // res.status(500).send({ message: err.message });
  }
};
export const checkCouponClient = async (req, res) => {
  try {
    console.log("check coupon");
    const { code, products, totalPrice } = req.body;
    const coupon = await CouponModel.findOne({ code: code });
    if (!coupon)
      return res.send({ message: "The coupon is not exist", status: "00" });

    const currentDate = new Date();
    const expireDate = new Date(coupon.expireDate);
    const hasRequiredProducts = hasAllRequiredProducts(
      coupon.requiredProducts,
      products
    );
    const hasSpecificProducts = hasAllRequiredProducts(
      coupon.specificProducts,
      products
    );
    if (expireDate < currentDate)
      return res.send({ message: `Mã khuyến mãi đã hết hạn`, status: "00" });
    if (coupon.totalUsageLimit === 0)
      return res.send({ message: "Mã khuyến mãi đã dùng hết", status: "00" });
    if (coupon.userUsageLimit === 0)
      return res.send({
        message: "Người dùng đã dùng mã khuyến mãi",
        status: "00",
      });
    if (coupon.minTotalPrice > totalPrice) {
      const remain = coupon.minTotalPrice - totalPrice;
      return res.send({
        money: remain,
        message: `Bạn cần mua thêm ${remain.toLocaleString(
          "vi-VN"
        )} VNĐ để áp dụng mã khuyến mãi`,
        status: "00",
      });
    }
    // if (
    //   coupon.allowedEmails.length > 0 &&
    //   !coupon.allowedEmails.includes(userEmail)
    // )
    //   return { message: "You are not allowed to use this coupon" };
    if (coupon.applyFor === "specific" && !hasSpecificProducts)
      return res.send({
        message: "Mã khuyến mãi chỉ áp dụng cho một số sản phẩm",
        status: "00",
      });
    if (!hasRequiredProducts)
      return res.send({
        message: "Mã khuyến mãi chỉ áp dụng cho một số sản phẩm",
        status: "00",
      });
    console.log("last");
    return res.send({
      message: "Bạn có thể sử dụng mã khuyến mãi",
      coupon,
      status: "01",
    });
  } catch (err) {
    console.log(err.message);
    // res.status(500).send({ message: err.message });
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
