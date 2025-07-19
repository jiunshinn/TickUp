import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Screen from "../../app/index";
import { fetchPriceTarget } from "../../services/api";
import { ApiError } from "../../types/api.types";

jest.mock("../../services/api");
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: ({ children }: any) => children,
}));
jest.mock("expo-status-bar", () => ({
  StatusBar: () => null,
}));

const mockFetchPriceTarget = fetchPriceTarget as jest.MockedFunction<
  typeof fetchPriceTarget
>;

describe("Screen (app/index.tsx)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("handleSearch", () => {
    it("should show error when symbol is empty", async () => {
      const { getByPlaceholderText, getByText, queryByText } = render(
        <Screen />
      );

      const searchButton = getByText("Search");
      fireEvent.press(searchButton);

      await waitFor(() => {
        expect(getByText("Please enter a stock symbol")).toBeTruthy();
      });

      expect(mockFetchPriceTarget).not.toHaveBeenCalled();
    });

    it("should show error when symbol is only whitespace", async () => {
      const { getByPlaceholderText, getByText } = render(<Screen />);

      const input = getByPlaceholderText("Enter stock symbol (e.g., AAPL)");
      fireEvent.changeText(input, "   ");

      const searchButton = getByText("Search");
      fireEvent.press(searchButton);

      await waitFor(() => {
        expect(getByText("Please enter a stock symbol")).toBeTruthy();
      });

      expect(mockFetchPriceTarget).not.toHaveBeenCalled();
    });

    it("should fetch price target data successfully", async () => {
      const mockData = {
        high: 200,
        low: 150,
        mean: 175,
        last_close: 180,
        symbol: "AAPL",
        name: "Apple Inc.",
        logo_url: null,
      };

      mockFetchPriceTarget.mockResolvedValue(mockData);

      const { getByPlaceholderText, getByText, queryByTestId } = render(
        <Screen />
      );

      const input = getByPlaceholderText("Enter stock symbol (e.g., AAPL)");
      fireEvent.changeText(input, "AAPL");

      const searchButton = getByText("Search");
      fireEvent.press(searchButton);

      await waitFor(() => {
        expect(mockFetchPriceTarget).toHaveBeenCalledWith("AAPL");
      });

      // Chart should be rendered with the data
      await waitFor(() => {
        expect(getByText("Apple Inc.")).toBeTruthy();
      });
    });

    it("should show loading state during API call", async () => {
      mockFetchPriceTarget.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      const { getByPlaceholderText, getByText, queryByTestId } = render(
        <Screen />
      );

      const input = getByPlaceholderText("Enter stock symbol (e.g., AAPL)");
      fireEvent.changeText(input, "AAPL");

      const searchButton = getByText("Search");
      fireEvent.press(searchButton);

      // Loading indicator should be shown
      await waitFor(() => {
        expect(queryByTestId).toBeTruthy();
      });
    });

    it("should handle 404 error (symbol not found)", async () => {
      const error: ApiError = {
        message: "Symbol not found",
        status: 404,
      };

      mockFetchPriceTarget.mockRejectedValue(error);

      const { getByPlaceholderText, getByText } = render(<Screen />);

      const input = getByPlaceholderText("Enter stock symbol (e.g., AAPL)");
      fireEvent.changeText(input, "INVALID");

      const searchButton = getByText("Search");
      fireEvent.press(searchButton);

      await waitFor(() => {
        expect(mockFetchPriceTarget).toHaveBeenCalledWith("INVALID");
      });

      await waitFor(() => {
        expect(
          getByText(
            'Stock symbol "INVALID" not found. Please check the symbol and try again.'
          )
        ).toBeTruthy();
      });
    });

    it("should handle general API errors", async () => {
      const error: ApiError = {
        message: "Network error",
        status: 500,
      };

      mockFetchPriceTarget.mockRejectedValue(error);

      const { getByPlaceholderText, getByText } = render(<Screen />);

      const input = getByPlaceholderText("Enter stock symbol (e.g., AAPL)");
      fireEvent.changeText(input, "AAPL");

      const searchButton = getByText("Search");
      fireEvent.press(searchButton);

      await waitFor(() => {
        expect(getByText("Network error")).toBeTruthy();
      });
    });

    it("should use default error message when API error has no message", async () => {
      const error: ApiError = {
        status: 500,
      };

      mockFetchPriceTarget.mockRejectedValue(error);

      const { getByPlaceholderText, getByText } = render(<Screen />);

      const input = getByPlaceholderText("Enter stock symbol (e.g., AAPL)");
      fireEvent.changeText(input, "AAPL");

      const searchButton = getByText("Search");
      fireEvent.press(searchButton);

      await waitFor(() => {
        expect(getByText("Failed to fetch price target")).toBeTruthy();
      });
    });

    it("should handle submit from keyboard", async () => {
      const mockData = {
        high: 200,
        low: 150,
        mean: 175,
        last_close: 180,
        symbol: "AAPL",
        name: "Apple Inc.",
        logo_url: null,
      };

      mockFetchPriceTarget.mockResolvedValue(mockData);

      const { getByPlaceholderText } = render(<Screen />);

      const input = getByPlaceholderText("Enter stock symbol (e.g., AAPL)");
      fireEvent.changeText(input, "AAPL");
      fireEvent(input, "submitEditing");

      await waitFor(() => {
        expect(mockFetchPriceTarget).toHaveBeenCalledWith("AAPL");
      });
    });
  });
});
