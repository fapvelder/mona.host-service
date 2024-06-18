import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
dotenv.config();

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Express API with Swagger",
    version: "1.0.0",
    description:
      "This is a simple CRUD API application made with Express and documented with Swagger",
  },
  servers: [
    {
      url: process.env.LOCALHOST,
    },
    {
      url: process.env.IP,
    },
    {
      url: process.env.NGROK,
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./controllers/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default setupSwagger;
