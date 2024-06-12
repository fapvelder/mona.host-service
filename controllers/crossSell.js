import { CrossSellModel } from "../models/crossSell.js";

/**
 * @swagger
 * tags:
 *   name: CrossSell
 *   description: Cross Sell options management
 */

/**
 * @swagger
 * /cross-sell:
 *   get:
 *     summary: Get cross-sell options
 *     tags: [CrossSell]
 *     description: Retrieve cross-sell options based on the provided option ID(s)
 *     parameters:
 *       - in: query
 *         name: optionID
 *         description: Array of option IDs
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 crossSells:
 *                   type: array
 *                   items:
 *                     $ref: './models/crossSell'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                 error:
 *                   type: object
 *                   description: Error details
 */
export const getCrossSell = async (req, res) => {
  try {
    const { optionID } = req.query;

    const options = Array.isArray(optionID) ? optionID : [optionID];
    console.log(options);
    if (options.length < 1) {
      const crossSells = await CrossSellModel.find({})
        .populate("crossSellOption")
        .populate("option");
      return res.status(200).json({
        message: "Cross-sell options retrieved successfully",
        crossSells,
      });
    }
    console.log("here");
    let crossSells = await CrossSellModel.find({
      option: { $eq: options },
      $expr: { $eq: [{ $size: "$option" }, options.length] },
    })
      .populate("crossSellOption")
      .populate("option");

    crossSells = crossSells.map((crossSell) => {
      crossSell.crossSellOption = crossSell.crossSellOption.filter(
        (option) => !options.includes(option._id.toString())
      );
      return crossSell;
    });
    console.log(crossSells);
    // Send a success response
    res.status(200).json({
      message: "Cross-sell options retrieved successfully",
      crossSells,
    });
  } catch (error) {
    // Send an error response
    res.status(500).json({ message: "An error occurred", error });
  }
};

/**
 * @swagger
 * /cross-sell:
 *   post:
 *     summary: Add cross-sell option
 *     tags: [CrossSell]
 *     description: Add a new cross-sell option
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               option:
 *                 type: string
 *                 description: ID of the option
 *               crossSellOption:
 *                 type: string
 *                 description: ID of the cross-sell option
 *     responses:
 *       201:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 crossSell:
 *                   $ref: './models/crossSell'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                 error:
 *                   type: object
 *                   description: Error details
 */
export const addCrossSell = async (req, res) => {
  try {
    const { option, crossSellOption } = req.body;
    console.log(typeof option);
    // Create a new CrossSell document
    const crossSell = new CrossSellModel({
      option,
      crossSellOption,
    });
    // Save the document to the database
    await crossSell.save();

    // Send a success response
    res
      .status(201)
      .json({ message: "Cross-sell option added successfully", crossSell });
  } catch (error) {
    // Send an error response
    res.status(500).json({ message: "An error occurred", error });
  }
};

/**
 * @swagger
 * /cross-sell/{crossSellId}:
 *   delete:
 *     summary: Delete cross-sell option
 *     tags: [CrossSell]
 *     description: Delete a cross-sell option by ID
 *     parameters:
 *       - in: path
 *         name: crossSellId
 *         description: ID of the cross-sell option to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                 error:
 *                   type: object
 *                   description: Error details
 */
export const deleteCrossSell = async (req, res) => {
  try {
    const { crossSellId } = req.params;
    // Find the cross-sell option by ID and delete it
    await CrossSellModel.findByIdAndDelete(crossSellId);
    // Send a success response
    res.status(200).json({ message: "Cross-sell option deleted successfully" });
  } catch (error) {
    // Send an error response
    res.status(500).json({ message: "An error occurred", error });
  }
};
