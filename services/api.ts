import axios from "axios";
import { PriceTargetResponse, ApiError } from "../types/api.types";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_BASE_URL) {
  console.warn("API_BASE_URL not found in environment variables");
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchPriceTarget = async (
  symbol: string
): Promise<PriceTargetResponse> => {
  try {
    const response = await apiClient.get<PriceTargetResponse>(
      `/assessment/price-target?symbol=${symbol.toUpperCase()}`
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const apiError: ApiError = {
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch price target",
        status: error.response?.status || 500,
      };

      if (error.response?.status === 404) {
        apiError.message = `Symbol '${symbol}' not found`;
      }

      throw apiError;
    }

    throw {
      message: "An unexpected error occurred",
      status: 500,
    } as ApiError;
  }
};
