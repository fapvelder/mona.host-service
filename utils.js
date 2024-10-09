import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

export const axiosInstance = axios.create({
  baseURL: process.env.HOST_URL,
  headers: {
    "Content-Type": "application/json",
    Key: process.env.HOST_KEY,
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error("Error in request interceptor:", error);
    return Promise.reject(error);
  }
);
