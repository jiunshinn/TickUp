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
  priceToX: ScaleLinear<number, number>
): ChartPoint[] => {
  const { high, low, mean, last_close } = data;
  const allTargetsSame = high === low && low === mean;

  const points = [
    {
      type: "Low",
      value: low,
      x: priceToX(low),
      color: "#3478F6",
      yLevel: 0,
      show: !allTargetsSame,
    },
    {
      type: "Average",
      value: mean,
      x: priceToX(mean),
      color: "#3478F6",
      yLevel: 0,
      show: !allTargetsSame,
    },
    {
      type: "High",
      value: high,
      x: priceToX(high),
      color: "#3478F6",
      yLevel: 0,
      show: !allTargetsSame,
    },
    {
      type: "Last Close",
      value: last_close,
      x: priceToX(last_close),
      color: "#555555",
      yLevel: 0,
      show: true,
    },
    {
      type: "Low, High, Avg",
      value: mean,
      x: priceToX(mean),
      color: "#3478F6",
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
  const sortedPoints = [...points].sort((a, b) => a.x - b.x);

  const result: ChartPoint[] = [];

  sortedPoints.forEach((point, i) => {
    let yLevel = 0;
    if (i > 0) {
      const prev = result[i - 1];
      if (Math.abs(point.x - prev.x) < threshold) {
        yLevel = prev.yLevel === 0 ? 1 : 0;
      }
    }
    result.push({ ...point, yLevel });
  });

  return result;
};
