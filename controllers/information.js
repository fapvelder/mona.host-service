import dotenv from "dotenv";
import { axiosInstance } from "../utils.js";

dotenv.config();

export const getCities = async (req, res) => {
  const { data } = await axiosInstance.get(
    `${process.env.HOST_URL}/locations/province`
  );
  return res.status(200).send(data);
};
export const getDistricts = async (req, res) => {
  const { data } = await axiosInstance.get(
    `${process.env.HOST_URL}/locations/districts?province_code_name=${req.query.province_code_name}`
  );
  return res.status(200).send(data);
};
export const getWards = async (req, res) => {
  const { data } = await axiosInstance.get(
    `${process.env.HOST_URL}/locations/wards?province_code_name=${req.query.province_code_name}&district_code_name=${req.query.district_code_name}`
  );
  return res.status(200).send(data);
};
