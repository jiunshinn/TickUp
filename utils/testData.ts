import { PriceTargetResponse } from "../types/api.types";

// Test data for various edge cases
export const testScenarios: { [key: string]: PriceTargetResponse } = {
  // Normal case - well-spaced values
  normal: {
    high: 200,
    low: 150,
    mean: 175,
    last_close: 180,
    symbol: "TEST",
    name: "Normal Case",
    logo_url: null,
  },

  // Edge case 1: Overlapping values (Low ≈ Avg ≈ High)
  overlapping: {
    high: 100.5,
    low: 99.5,
    mean: 100,
    last_close: 95,
    symbol: "OVER",
    name: "Overlapping Values",
    logo_url: null,
  },

  // Edge case 2: All targets same value
  allSame: {
    high: 150,
    low: 150,
    mean: 150,
    last_close: 145,
    symbol: "SAME",
    name: "All Targets Same",
    logo_url: null,
  },

  // Edge case 3: Last Close outside range (below)
  lastCloseBelow: {
    high: 200,
    low: 150,
    mean: 175,
    last_close: 120,
    symbol: "BELOW",
    name: "Last Close Below Range",
    logo_url: null,
  },

  // Edge case 4: Last Close outside range (above)
  lastCloseAbove: {
    high: 200,
    low: 150,
    mean: 175,
    last_close: 220,
    symbol: "ABOVE",
    name: "Last Close Above Range",
    logo_url: null,
  },

  // Edge case 5: Very close values requiring collision detection
  closeValues: {
    high: 100.2,
    low: 99.8,
    mean: 100.1,
    last_close: 100.05,
    symbol: "CLOSE",
    name: "Very Close Values",
    logo_url: null,
  },

  // Edge case 6: Large price range
  largeRange: {
    high: 1000,
    low: 10,
    mean: 505,
    last_close: 750,
    symbol: "LARGE",
    name: "Large Price Range",
    logo_url: null,
  },
};