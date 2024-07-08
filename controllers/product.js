import { ProductModel } from "../models/product.js";
import mongoose from "mongoose";
import { checkCoupon } from "./coupon.js";
import axios from "axios";
import {
  orderHost,
  productDomain,
  productSSLAndCPanel,
} from "../product-host.js";
/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product management
 */

/**
 * @swagger
 * /product-type:
 *   get:
 *     summary: Retrieve a list of product types
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: optionName
 *         schema:
 *           type: string
 *         description: The name of the product option to search for
 *     responses:
 *       200:
 *         description: A list of product types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   product:
 *                     type: string
 *                   optionName:
 *                     type: string
 *                   optionPrice:
 *                     type: number
 *                   basePrice:
 *                     type: number
 *                   period:
 *                     type: number
 *                   discount:
 *                     type: number
 *                   upSell:
 *                     type: boolean
 *                   information:
 *                     type: object
 *                     properties:
 *                       feature_tooltip:
 *                         type: string
 *                       features:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             description:
 *                               type: string
 *                             tooltip:
 *                               type: string
 *                       securities:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             description:
 *                               type: string
 *                             tooltip:
 *                               type: string
 *                       services:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             description:
 *                               type: string
 *                             tooltip:
 *                               type: string
 *                       specifications:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             description:
 *                               type: string
 *                             tooltip:
 *                               type: string
 *       500:
 *         description: Server error
 */
export const getProductsByIds = async (req, res) => {
  try {
    const productsInfo = req.body.products; // Assuming the array of objects is passed in the request body
    if (!Array.isArray(productsInfo)) {
      return res
        .status(400)
        .send({ message: "Input should be an array of objects" });
    }

    const ids = productsInfo.map((product) => product.id);
    const products = await ProductModel.find({ _id: { $in: ids } })
      .populate("productType", "name")
      .populate({
        path: "crossSells.requiredProduct.product",
        model: "Product",
        populate: [
          {
            path: "productType",
            model: "ProductType",
            select: "name",
          },
        ],
      })
      .populate({
        path: "crossSells.crossSellProduct.product",
        model: "Product",
        populate: [
          {
            path: "productType",
            model: "ProductType",
            select: "name",
          },
        ],
      });
    if (products.length === 0) {
      return res.status(404).send({ message: "Products not found" });
    }

    const orderedProducts = ids.map((id) =>
      products.find((product) => product.id.toString() === id)
    );
    const enhancedProducts = orderedProducts.map((product, index) => {
      const plainProduct = product.toObject(); // Convert to plain object
      const additionalFields = productsInfo.find(
        (p, pIndex) => pIndex === index
      );
      if (additionalFields) {
        plainProduct.packageName = additionalFields.packageName;
        plainProduct.period = additionalFields.period;
      }

      return plainProduct;
    });

    return res.status(200).send(enhancedProducts);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById(id)
      .populate("productType", "name")
      .populate({
        path: "crossSells.requiredProduct.product",
        model: "Product",
        populate: [
          {
            path: "productType",
            model: "ProductType",
            select: "name",
          },
          // {
          //   path: "crossSells.requiredProduct.product",
          //   model: "Product",
          // },
          // {
          //   path: "crossSells.crossSellProduct.product",
          //   model: "Product",
          // },
        ],
      })
      .populate({
        path: "crossSells.crossSellProduct.product",
        model: "Product",
        populate: [
          {
            path: "productType",
            model: "ProductType",
            select: "name",
          },
          // {
          //   path: "crossSells.requiredProduct.product",
          //   model: "Product",
          // },
          // {
          //   path: "crossSells.crossSellProduct.product",
          //   model: "Product",
          // },
        ],
      });
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    return res.status(200).send(product);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
export const getProductsWithAdditionalFields = async (req, res) => {
  try {
    const productsInfo = req.body.products;
    if (!Array.isArray(productsInfo)) {
      return res
        .status(400)
        .send({ message: "Input should be an array of objects" });
    }

    const ids = productsInfo.map((product) => product.id);

    const products = await ProductModel.find({ _id: { $in: ids } })
      .populate("productType", "name")
      .select("-crossSells -crossSellDescription -packages.information");

    if (products.length === 0) {
      return res.status(404).send({ message: "Products not found" });
    }
    const orderedProducts = ids.map((id) =>
      products.find((product) => product.id.toString() === id)
    );
    const enhancedProducts = orderedProducts.map((product, index) => {
      const plainProduct = product.toObject(); // Convert to plain object
      const additionalFields = productsInfo.find(
        (p, pIndex) => pIndex === index
      );
      if (additionalFields) {
        plainProduct.packageName = additionalFields.packageName;
        plainProduct.period = additionalFields.period;
        // Calculate totalSalePrice and totalBasePrice
        const selectedPackage = plainProduct.packages.find(
          (pkg) => pkg.name === additionalFields.packageName
        );
        if (selectedPackage) {
          const selectedPeriod = selectedPackage.period.find(
            (p) => p.months === additionalFields.period
          );
          plainProduct.salePrice = selectedPeriod
            ? selectedPeriod.salePrice
            : 0;
          plainProduct.basePrice = selectedPeriod
            ? selectedPeriod.basePrice
            : 0;
        } else {
          plainProduct.salePrice = 0;
          plainProduct.basePrice = 0;
        }
      }

      return plainProduct;
    });
    const filteredProducts = enhancedProducts
      .filter((p) => p.name !== "Domain")
      .map((product) => {
        return {
          id: product._id,
          name: product.name,
          packageName: product.packageName,
          period: product.period,
          basePrice: product.basePrice,
          os: product.os,
        };
      });
    if (req.originalUrl === "/product/get-price-products-by-ids") {
      return res.status(200).send(filteredProducts);
    } else {
      return filteredProducts;
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { name } = req.query;
    const query = name ? { name: { $regex: name, $options: "i" } } : {};
    const products = await ProductModel.find(query)
      .sort({
        createdAt: -1,
      })
      .populate("productType", "name")
      .populate({
        path: "crossSells.requiredProduct.product",
        model: "Product",
        select: "-packages.information",
        populate: [
          {
            path: "productType",
            model: "ProductType",
            select: "name",
          },
          {
            path: "crossSells.requiredProduct.product",
            model: "Product",
            select: "-packages.information",
          },
          {
            path: "crossSells.crossSellProduct.product",
            model: "Product",
            select: "-packages.information",
          },
        ],
      })
      .populate({
        path: "crossSells.crossSellProduct.product",
        model: "Product",
        select: "-packages.information",
        populate: [
          {
            path: "productType",
            model: "ProductType",
            select: "name",
          },
          {
            path: "crossSells.requiredProduct.product",
            model: "Product",
            select: "-packages.information",
          },
          {
            path: "crossSells.crossSellProduct.product",
            model: "Product",
            select: "-packages.information",
          },
        ],
      });

    res.status(200).send(products);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
const checkDomain = async (domain) => {
  // try {
  const { data } = await axios.get(
    `${process.env.HOST_URL}/domains/check/available?domains=${domain}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Key: process.env.HOST_KEY,
      },
    }
  );
  return data;
  // } catch (err) {
  //   return res.status(500).send({ message: err.message });
  // }
};
export const calculateTotalPrice = async (req, res) => {
  try {
    const { products, domains, coupon } = req.body;

    const productIds = products.map((p) => p.id);
    const fetchedProducts = await ProductModel.find({
      _id: { $in: productIds },
    })
      .populate("productType", "name")
      .populate({
        path: "crossSells.requiredProduct.product",
        model: "Product",
        populate: [
          {
            path: "productType",
            model: "ProductType",
            select: "name",
          },
          {
            path: "crossSells.requiredProduct.product",
            model: "Product",
          },
          {
            path: "crossSells.crossSellProduct.product",
            model: "Product",
          },
        ],
      })
      .populate({
        path: "crossSells.crossSellProduct.product",
        model: "Product",
        populate: [
          {
            path: "productType",
            model: "ProductType",
            select: "name",
          },
          {
            path: "crossSells.requiredProduct.product",
            model: "Product",
          },
          {
            path: "crossSells.crossSellProduct.product",
            model: "Product",
          },
        ],
      });
    // Calculate total price
    let totalPrice = 0;
    let totalBasePrice = 0;
    let totalSalePrice = 0;
    let totalSale = 0;
    let itemSale = [];
    let totalBasePriceWithoutDomain = 0;
    let totalSalePriceWithoutDomain = 0;
    const calculateDiscount = async () => {
      const promises = [];
      if (domains && domains.length > 0) {
        const domainPromises = domains.map(async (domain) => {
          const data = await checkDomain(domain.name);
          if (data) {
            const domainPrice = data.results[0].buy_price * domain.year;
            totalBasePrice += domainPrice;
            totalPrice += domainPrice;
          }
        });
        promises.push(...domainPromises);
      }

      products.map((product) => {
        const productFromDB = fetchedProducts.find(
          (p) => p._id.toString() === product.id
        );
        if (productFromDB) {
          productFromDB.packages.forEach((pkg) => {
            if (pkg.name === product.packageName) {
              const period = pkg.period.find(
                (p) => p.months === product.period
              );
              if (period) {
                totalPrice += period.salePrice;
                totalBasePrice += period.basePrice;
                totalSalePrice += period.salePrice;
                totalBasePriceWithoutDomain += period.basePrice;
                totalSalePriceWithoutDomain += period.salePrice;
              }
            }
          });
        }

        // Fetch products === cart items
        fetchedProducts.map((fetchProd) =>
          fetchProd.crossSells.map((crossSell) =>
            crossSell.crossSellProduct.map((crossProd) =>
              crossSell.requiredProduct.map((reqProd) => {
                const haveRequiredProductInCart = products.some(
                  (p) => p.id.toString() === reqProd.product._id.toString()
                );
                const haveSpecificProductInCart = products.some(
                  (p) =>
                    p.id.toString() === reqProd.product._id.toString() &&
                    p.period === reqProd.period
                );

                if (
                  haveSpecificProductInCart &&
                  product.period === reqProd.period &&
                  product.packageName === crossProd.packageName &&
                  crossProd.product._id.toString() === product.id.toString()
                ) {
                  // No operation needed
                  const promise = getSalePrice(
                    product.id,
                    product.packageName,
                    product.period
                  ).then((price) => {
                    const discount = (crossProd.discountCrossSell || 0) / 100;
                    // totalPrice -= price * discount;
                    // console.log("total inside", totalPrice);

                    itemSale.push({
                      _id: product.id,
                      name: crossProd.product.name,
                      packageName: product.packageName,
                      period: product.period,
                      discount: price * discount,
                      percentage: crossProd.discountCrossSell,
                    });
                  });
                  promises.push(promise);
                } else if (
                  haveRequiredProductInCart &&
                  !reqProd.period &&
                  crossProd.product._id.toString() === product.id.toString()
                ) {
                  const promise = getSalePrice(
                    product.id,
                    product.packageName,
                    product.period
                  ).then((price) => {
                    const discount = (crossProd.discountCrossSell || 0) / 100;
                    // totalPrice -= price * discount;
                    itemSale.push({
                      _id: product.id,
                      name: crossProd.product.name,
                      packageName: product.packageName,
                      period: product.period,
                      discount: price * discount,
                      percentage: crossProd.discountCrossSell,
                    });
                  });
                  promises.push(promise);
                }
              })
            )
          )
        );
      });

      await Promise.all(promises);
      const item = filterPackages(itemSale);
      if (item.length > 0) {
        item.forEach((i) => {
          totalPrice -= i.discount;
          totalSale += i.discount;
        });
      }
      return totalPrice;
    };

    totalPrice = await calculateDiscount();

    const saleByProduct =
      totalBasePriceWithoutDomain - totalSalePriceWithoutDomain;
    const item = filterPackages(itemSale);
    let promoSale = 0;
    let promoMessage = "You do not apply any coupon";
    const statusReject = "00";
    const statusAccept = "01";
    const statusDoesNotApply = "02";
    let promo;
    let promoStatus = statusDoesNotApply;
    if (coupon) {
      const couponInfo = await checkCoupon(
        req,
        res,
        coupon,
        products,
        totalPrice
      );
      promo = couponInfo.coupon;
      if (couponInfo.status === statusAccept) {
        if (promo.type === "fixed") {
          promoSale = promo.amount;
        }
        if (promo.type === "percentage") {
          console.log(promo.minTotalPrice);
          const maxDiscount = promo.maxDiscount;
          if (promo.maxDiscount > 0) {
            const discount = totalPrice * (promo.amount / 100);
            const roundedNumber = Math.round(discount / 1000) * 1000;
            promoSale =
              roundedNumber > maxDiscount ? maxDiscount : roundedNumber;
          }
        }
        promoMessage = couponInfo.message;
        promoStatus = statusAccept;
      } else if (couponInfo.status === statusReject) {
        promoMessage = couponInfo.message;
        promoStatus = statusReject;
      }
    }
    if (promoSale > 0) {
      totalPrice -= promoSale;
    }
    const VAT = (totalPrice * 10) / 100;
    const totalPriceIncludedVAT = totalPrice + VAT;
    const totalSaleWithoutPromo = saleByProduct + totalSale;
    if (req.originalUrl === "/product/calculate") {
      res.status(200).send({
        totalBasePrice: totalBasePrice,
        totalSalePrice: totalSalePrice,
        totalSaleByProduct: saleByProduct,
        totalSaleWithoutPromo: totalSaleWithoutPromo,
        totalSaleSubtractByCrossSale: totalSale,
        totalPriceAfterCrossSaleAndPromo: totalPrice,
        totalPriceIncludedVAT: totalPriceIncludedVAT,
        promoSale: promoSale,
        promoMessage: promoMessage,
        promoStatus: promoStatus,
        VAT: VAT,
        itemSale: item,
        coupon: promo,
      });
    } else {
      return {
        totalBasePrice: totalBasePrice,
        totalSalePrice: totalSalePrice,
        totalSaleByProduct: saleByProduct,
        totalSaleWithoutPromo: totalSaleWithoutPromo,
        totalSaleSubtractByCrossSale: totalSale,
        totalPriceAfterCrossSaleAndPromo: totalPrice,
        totalPriceIncludedVAT: totalPriceIncludedVAT,
        promoSale: promoSale,
        promoMessage: promoMessage,
        promoStatus: promoStatus,
        VAT: VAT,
        itemSale: item,
        coupon: promo,
      };
    }
  } catch (err) {
    console.log("err", err);
    res.status(500).send({ message: err.message });
  }
};
const filterPackages = (packages) => {
  const packageMap = {};

  packages.forEach((pkg) => {
    const key = `${pkg.name}-${pkg.packageName}-${pkg.period}`;

    if (!packageMap[key] || packageMap[key].discount < pkg.discount) {
      packageMap[key] = pkg;
    }
  });

  return Object.values(packageMap);
};

const getSalePrice = async (ID, packageName, period) => {
  const product = await ProductModel.findById(ID);
  const thisPackage = product.packages.find((pkg) => pkg.name === packageName);
  const price = thisPackage.period.find((pr) => pr.months === period).salePrice;
  return price;
};
export const getVPS = async (req, res) => {
  try {
    const linux = await ProductModel.find({
      name: { $regex: "Mona Linux VPS", $options: "i" },
    }).sort({
      createdAt: -1,
    });
    const window = await ProductModel.find({
      name: { $regex: "Mona Windows VPS", $options: "i" },
    }).sort({
      createdAt: -1,
    });
    const products = [...linux, ...window];
    res.status(200).send(products);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
/**
 * @swagger
 * /product-type:
 *   post:
 *     summary: Create a new product option
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productID:
 *                 type: string
 *               optionName:
 *                 type: string
 *               optionPrice:
 *                 type: number
 *               basePrice:
 *                 type: number
 *               period:
 *                 type: number
 *               discount:
 *                 type: number
 *               upSell:
 *                 type: boolean
 *               information:
 *                 type: object
 *                 properties:
 *                   feature_tooltip:
 *                      type: string
 *                   features:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         description:
 *                           type: string
 *                         tooltip:
 *                           type: string
 *                   securities:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         description:
 *                           type: string
 *                         tooltip:
 *                           type: string
 *                   services:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         description:
 *                           type: string
 *                         tooltip:
 *                           type: string
 *                   specifications:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         description:
 *                           type: string
 *                         tooltip:
 *                           type: string
 *     responses:
 *       200:
 *         description: The created product option
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 product:
 *                   type: string
 *                 optionName:
 *                   type: string
 *                 optionPrice:
 *                   type: number
 *                 basePrice:
 *                   type: number
 *                 period:
 *                   type: number
 *                 discount:
 *                   type: number
 *                 upSell:
 *                   type: boolean
 *                 information:
 *                   type: object
 *                   properties:
 *                     features:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           description:
 *                             type: string
 *                           tooltip:
 *                             type: string
 *                     securities:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           description:
 *                             type: string
 *                           tooltip:
 *                             type: string
 *                     services:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           description:
 *                             type: string
 *                           tooltip:
 *                             type: string
 *                     specifications:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           description:
 *                             type: string
 *                           tooltip:
 *                             type: string
 *       500:
 *         description: Server error
 */
export const createProduct = async (req, res, next) => {
  try {
    const { productData } = req.body;
    const newProductDiscount = {
      productType: productData.product,
      // information: {
      //   feature_tooltip: productData.featureTooltip,
      //   features: productData.features,
      //   securities: productData.securities,
      //   services: productData.services,
      //   specifications: productData.specifications,
      // },
      ...productData,
    };
    const productDiscount = new ProductModel(newProductDiscount);
    await productDiscount.save();
    res.status(200).json(productDiscount);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
export const createPackageProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { packageData } = req.body;
    const product = await ProductModel.findById(id);
    if (!product) {
      res.status(404).send({ message: "Product not found" });
    }
    product.packages.push(packageData);
    const updatedProduct = await product.save();
    res.status(201).json(updatedProduct);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const duplicateProduct = async (req, res) => {
  try {
    const originalItem = await ProductModel.findById(req.params.id);
    if (!originalItem) {
      return res.status(404).send("Item not found");
    }
    const { _id, ...product } = originalItem._doc;
    // Create a copy of the item using the spread operator
    const duplicatedItem = new ProductModel({
      ...product,
      createdAt: new Date(),
    });

    await duplicatedItem.save();
    res.status(201).send(duplicatedItem);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { productData } = req.body;
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      {
        productType: productData.product,
        // information: {
        //   feature_tooltip: productData.featureTooltip,
        //   features: productData.features,
        //   securities: productData.securities,
        //   services: productData.services,
        //   specifications: productData.specifications,
        // },
        ...productData,
      },
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await ProductModel.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).send({ message: "Product Option not found" });
    }
    res.status(200).json(deletedProduct);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const upSell = async (req, res) => {
  try {
    const { optionID } = req.query;
    if (!optionID) {
      return res.status(404).send({ message: "Invalid option ID" });
    }
    const productType = await ProductModel.findById(optionID);
    if (!productType) {
      return res.status(404).send({ message: "Product not found" });
    }
    const upsellProducts = await ProductModel.find({
      name: productType.name,
    }).select("-information -upSell");

    if (upsellProducts) {
      return res.status(200).send(upsellProducts);
    }
    return res.status(204).send({ message: "No up-sell products" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
export const getSameProducts = async (req, res) => {
  try {
    const { name } = req.query;
    const products = await ProductModel.find({ name: name });
    console.log(products.length);
    if (!products) {
      return res.status(404).send({ message: "Product not found" });
    }
    res.status(200).send(products);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { domains, userDomain, userData, payment } = req.body;
    const token = extractBearerToken(req, res);
    let orderItems = [];
    let domainProducts = [];
    const promises = [];

    if (domains && domains.length > 0) {
      const domainPromises = domains.map(async (domain) => {
        const data = await checkDomain(domain.name);
        if (data)
          domainProducts.push({ ...data.results[0], year: domain.year });
      });
      promises.push(...domainPromises);
    }
    const data = await calculateTotalPrice(req, res);
    const products = await getProductsWithAdditionalFields(req, res);

    const productPromises = products.map(async (product, index) => {
      if (product.name === "Business" || product.name === "SSL") {
        const data = await getProductHost(
          product.name === "Business"
            ? `${product.name} ${product.packageName}`
            : `${product.packageName} ${product.name}`,
          token
        );
        const productData = productSSLAndCPanel(product, data, userDomain);
        orderItems.push(productData);
      }
    });
    promises.push(...productPromises);

    if (domainProducts && domainProducts.length > 0) {
      domainProducts.map((domain) =>
        orderItems.push(productDomain(userData, domain))
      );
    }
    const { totalPriceIncludedVAT, VAT } = data;
    await Promise.all(promises);
    const allData = {
      domainProducts: domainProducts.length > 0 ? domainProducts : [],
      products: products.length > 0 ? products : [],
      priceInformation: data,
    };

    const order = orderHost(
      userData.clients[0]._id,
      totalPriceIncludedVAT,
      VAT,
      JSON.stringify(allData),
      orderItems
    );
    if (order) {
      const data = await createOrderHost(order, token);
      if (data) {
        if (payment === "acb") {
          const vietQR = await getVietQR(data._id, token);
          return res.status(200).send({ data, vietQR });
        } else if (payment === "vnpay") {
          const vnpay = await getVNPAY(data._id, token);
          return res.status(200).send({ data, vnpay });
        }
      }
    }
    return res.status(200).send(data);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
const getProductHost = async (productName, token) => {
  const { data } = await axios.get(
    `${process.env.HOST_URL}/products?search=${productName}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Key: process.env.HOST_KEY,
      },
    }
  );
  return data.results[0];
};
const extractBearerToken = (req, res) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7); // Extract the token part after "Bearer "
    return token;
  } else {
    return { message: "Unauthorized: No token provided" };
  }
};
const createOrderHost = async (order, token) => {
  const { data } = await axios.post(`${process.env.HOST_URL}/orders`, order, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};
const getVietQR = async (orderID, token) => {
  const { data } = await axios.get(
    `${process.env.HOST_URL}/payments/vietqr/generate?order_id=${orderID}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data.qr_data_url;
};
const getVNPAY = async (order_id, token) => {
  const { data } = await axios.post(
    `${process.env.HOST_URL}/payments/vnpay/media`,
    { order_id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Key: `${process.env.HOST_KEY}`,
      },
    }
  );
  return data.vnpay_payment_url;
};
