import axios from "axios";
import {
  getFoursquareApiKey,
  getFoursquareBaseUrl,
} from "../config/env.js";

const apiKey = getFoursquareApiKey();
const baseURL = getFoursquareBaseUrl();

export const foursquareClient = axios.create({
  baseURL: baseURL,
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "X-Places-Api-Version": "2025-06-17",
    Accept: "application/json",
  },
  timeout: 5000,
});
