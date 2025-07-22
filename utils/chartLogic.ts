import { ScaleLinear } from "d3-scale";
import { PriceTargetResponse } from "../types/api.types";
import { ChartPoint } from "../types/chart.types";

export const calculateScaleDomain = (data: PriceTargetResponse) => {
  const { high, low, mean, last_close } = data;
  const allPrices = [high, low, mean, last_close];
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  const range = maxPrice - minPrice;

  const padding = range === 0 ? 10 : range * 0.15;
  return {
    scaleMin: minPrice - padding,
    scaleMax: maxPrice + padding,
  };
};

export const prepareChartPoints = (
  data: PriceTargetResponse,
  priceToX: ScaleLinear<number, number>,
  chartWidth: number
): ChartPoint[] => {
  const { high, low, mean, last_close } = data;
  const allTargetsSame = high === low && low === mean;

  const points = [
    {
      type: "Low",
      value: low,
      x: 6, // Inset by radius + stroke to prevent overflow
      color: "#A1A1A1", // Light grey as per Figma
      yLevel: 1, // Bottom position as per requirements
      show: !allTargetsSame,
    },
    {
      type: "Average",
      value: mean,
      x: priceToX(mean),
      color: "#B9D7EE", // Light blue as per Figma
      yLevel: 0, // Top position as per requirements
      show: !allTargetsSame,
    },
    {
      type: "High",
      value: high,
      x: chartWidth - 6, // Inset by radius + stroke to prevent overflow
      color: "#A1A1A1", // Light grey as per Figma
      yLevel: 1, // Bottom position as per requirements
      show: !allTargetsSame,
    },
    {
      type: "Last Close",
      value: last_close,
      x: priceToX(last_close),
      color: "#585858", // Dark grey as per Figma
      yLevel: 1, // Bottom position as per requirements
      show: true,
    },
    {
      type: "Low, High, Avg",
      value: mean,
      x: priceToX(mean),
      color: "#B9D7EE", // Using Average color for consolidated marker
      yLevel: 0,
      show: allTargetsSame,
    },
  ];

  return points.filter((p) => p.show);
};

export const applyLabelCollision = (
  points: ChartPoint[],
  threshold: number
): ChartPoint[] => {
  // Keep the original yLevel based on point type, only adjust if collision
  const sortedPoints = [...points].sort((a, b) => a.x - b.x);
  const result: ChartPoint[] = [];

  sortedPoints.forEach((point, i) => {
    let adjustedPoint = { ...point };
    
    // Check for collisions with previous points
    for (let j = 0; j < i; j++) {
      const prev = result[j];
      if (Math.abs(adjustedPoint.x - prev.x) < threshold && adjustedPoint.yLevel === prev.yLevel) {
        // If collision at same level, try to find alternative position
        adjustedPoint.yLevel = adjustedPoint.yLevel === 0 ? 1 : 0;
      }
    }
    
    result.push(adjustedPoint);
  });

  return result;
};
