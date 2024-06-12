import { ProductTypeModel } from "../models/productType.js";

/**
 * @swagger
 * tags:
 *   name: ProductType
 *   description: Product options management
 */

/**
 * @swagger
 * /product-option:
 *   get:
 *     summary: Retrieve a list of product options
 *     tags: [ProductType]
 *     parameters:
 *       - in: query
 *         name: optionName
 *         schema:
 *           type: string
 *         description: The name of the product option to search for
 *     responses:
 *       200:
 *         description: A list of product options
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
export const getProductTypes = async (req, res) => {
  try {
    const { optionName } = req.query;
    const query = optionName
      ? { optionName: { $regex: optionName, $options: "i" } }
      : {};
    const products = await ProductTypeModel.find(query).sort({
      createdAt: -1,
    });
    res.status(200).send(products);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

/**
 * @swagger
 * /product-option:
 *   post:
 *     summary: Create a new product option
 *     tags: [ProductType]
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
export const createProductType = async (req, res, next) => {
  try {
    const newProductDiscount = {
      product: req.body.productID,
      ...req.body,
    };
    const productDiscount = new ProductTypeModel(newProductDiscount);
    await productDiscount.save();
    res.status(200).json(productDiscount);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

/**
 * @swagger
 * /product-option/{id}:
 *   put:
 *     summary: Update a product option
 *     tags: [ProductType]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product option to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
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
 *         description: The updated product option
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
export const updateProductType = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProductType = await ProductTypeModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedProductType);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

/**
 * @swagger
 * /product-option/{id}:
 *   delete:
 *     summary: Delete a product option
 *     tags: [ProductType]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product option to delete
 *     responses:
 *       200:
 *         description: The deleted product option
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
 *       404:
 *         description: Product Option not found
 *       500:
 *         description: Server error
 */
export const deleteProductType = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProductType = await ProductTypeModel.findByIdAndDelete(id);
    if (!deletedProductType) {
      return res.status(404).send({ message: "Product Option not found" });
    }
    res.status(200).json(deletedProductType);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

/**
 * @swagger
 * /product-option/up-sell:
 *   get:
 *     summary: Get up-sell products
 *     tags: [ProductType]
 *     parameters:
 *       - in: query
 *         name: optionID
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product option
 *     responses:
 *       200:
 *         description: The up-sell products
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
 *       204:
 *         description: No up-sell products
 *       404:
 *         description: Invalid option ID
 *       500:
 *         description: Server error
 */
export const upSell = async (req, res) => {
  try {
    const { optionID } = req.query;
    if (!optionID) {
      return res.status(404).send({ message: "Invalid option ID" });
    }
    const productType = await ProductTypeModel.findById(optionID);
    if (productType.upSell) {
      const upSellProduct = await ProductTypeModel.find({
        product: productType.product,
        upSell: true,
      });
      return res.status(200).send(upSellProduct);
    }
    return res.status(204).send({ message: "No up-sell products" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
