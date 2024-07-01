import { ProductModel } from "../models/product.js";
import mongoose from "mongoose";
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
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    return res.status(200).send(product);
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
        populate: {
          path: "productType",
          model: "ProductType",
          select: "name",
        },
      })
      .populate({
        path: "crossSells.crossSellProduct.product",
        model: "Product",
        populate: {
          path: "productType",
          model: "ProductType",
          select: "name",
        },
      });
    res.status(200).send(products);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
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
