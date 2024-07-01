import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import user from "./routers/user.js";
import product from "./routers/product.js";
import productType from "./routers/productType.js";
import crossSell from "./routers/crossSell.js";
import coupon from "./routers/coupon.js";
import dotenv from "dotenv";
import setupSwagger from "./swagger.js";
dotenv.config();

export const app = express();
const PORT = process.env.port || 5000;
app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ limit: "30mb" }));
app.use(morgan("combined"));
app.use(cookieParser());
const allowOrigin = [
  process.env.FRONTEND_URL,
  process.env.BACKEND_URL,
  process.env.NGROK,
  "*",
];
const corsOptions = {
  credentials: true,
  origin: "*",
  allowedHeaders: [
    "Origin",
    "Content-Type",
    "Accept",
    "x-access-token",
    "authorization",
    "x-signature",
    "custom-header",
  ],
  methods: "GET, HEAD, OPTIONS, PUT, PATCH, POST, DELETE",
  preflightContinue: false,
};

app.use(cors(corsOptions));
app.get("/", (req, res) => {
  res.send("SUCCESS");
  console.log("SUCCESS");
});

//cloudinary config
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// })
setupSwagger(app);

mongoose.connect(process.env.URI_MONGODB).catch((err) => {
  console.log("ERR", err);
});

// Example usage
app.listen(5000, () => {
  console.log("server is listening on port 5000");
});

// app.use("/category", category);
app.use("/user", user);
app.use("/product", product);
app.use("/product-type", productType);
app.use("/cross-sell", crossSell);
app.use("/coupon", coupon);
