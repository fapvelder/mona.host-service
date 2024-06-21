import { ProductTypeModel } from "../models/productType.js";
/**
 * @swagger
 * tags:
 *   name: ProductTypes
 *   description: ProductTypes management
 */

/**
 * @swagger
 * /product:
 *   get:
 *     summary: Retrieve a list of products
 *     tags: [ProductTypes]
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Server error
 */
export const getProductTypes = async (req, res) => {
  try {
    const products = await ProductTypeModel.find({}).sort({ createdAt: -1 });
    res.status(200).send(products);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const getProductTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const product = await ProductTypeModel.findById(id);
    res.status(200).send(product);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
/**
 * @swagger
 * /product:
 *   post:
 *     summary: Create a new product
 *     tags: [ProductTypes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "ProductType Name"
 *     responses:
 *       200:
 *         description: The created product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       500:
 *         description: Server error
 */

export const createProductType = async (req, res, next) => {
  try {
    const newProductType = {
      name: req.body.name,
    };
    const product = new ProductTypeModel(newProductType);

    await product.save();
    res.status(200).json(product);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

/**
 * @swagger
 * /product/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [ProductTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated ProductType Name"
 *     responses:
 *       200:
 *         description: The updated product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: ProductType not found
 *       500:
 *         description: Server error
 */
export const updateProductType = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProductType = {
      name: req.body.name,
      updatedAt: new Date(),
    };
    const product = await ProductTypeModel.findByIdAndUpdate(
      id,
      updatedProductType,
      {
        new: true,
      }
    );
    if (!product) {
      return res.status(404).send({ message: "ProductType not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

/**
 * @swagger
 * /product/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [ProductTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the product to delete
 *     responses:
 *       204:
 *         description: ProductType deleted successfully
 *       404:
 *         description: ProductType not found
 *       500:
 *         description: Server error
 */
export const deleteProductType = async (req, res) => {
  try {
    console.log("deleteProductType");
    const { id } = req.params;
    const product = await ProductTypeModel.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).send({ message: "ProductType not found" });
    }
    res.status(200).send({ message: "ProductType successfully deleted" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
