import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
export const generateDomains = async (req, res) => {
  try {
    const keyword = req.body.keyword;
    if (keyword.length < 3) {
      return res.status(403).send({ message: "Vui lòng điền ít nhất 3 kí tự" });
    }
    const payload = {
      keyword: keyword,
    };
    const response = await axios.post(
      `${process.env.HOST_URL}/domains/generate?limit=20`,
      payload,
      {
        headers: {
          Key: process.env.HOST_KEY,
        },
      }
    );
    res.send(response.data);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
export const getListDomains = async (req, res) => {
  try {
    const response = await axios.get(`${process.env.HOST_URL}/home/domains`);
    res.send(response.data);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
export const checkAvailableDomains = async (req, res) => {
  try {
    const domain = req.query.domain;
    const response = await axios.get(
      `${process.env.HOST_URL}/domains/check/available?domains=${domain}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Key: process.env.HOST_KEY,
        },
      }
    );
    res.send(response.data);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
export const checkWhoIs = async (req, res) => {
  try {
    const domain = req.query.domain;
    const response = await axios.get(
      `${process.env.HOST_URL}/domains/whois?domain=${domain}`,
      {
        headers: {
          Key: process.env.HOST_KEY,
        },
      }
    );
    res.send(response.data);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
