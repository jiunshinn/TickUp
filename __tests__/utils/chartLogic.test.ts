import { scaleLinear } from "d3-scale";
import {
  calculateScaleDomain,
  prepareChartPoints,
  applyLabelCollision,
} from "../../utils/chartLogic";
import { PriceTargetResponse } from "../../types/api.types";

const baseData: PriceTargetResponse = {
  low: 100,
  mean: 150,
  high: 200,
  last_close: 175,
  name: "Test",
  symbol: "TEST",
  logo_url: "https://example.com/logo.png",
};
const allSameData: PriceTargetResponse = {
  low: 150,
  mean: 150,
  high: 150,
  last_close: 160,
  name: "Test",
  symbol: "TEST",
  logo_url: "https://example.com/logo.png",
};
const outOfBoundsData: PriceTargetResponse = {
  low: 100,
  mean: 150,
  high: 200,
  last_close: 250,
  name: "Test",
  symbol: "TEST",
  logo_url: "https://example.com/logo.png",
};

describe("chartLogic", () => {
  describe("calculateScaleDomain", () => {
    it("should calculate the correct domain for the base case", () => {
      const { scaleMin, scaleMax } = calculateScaleDomain(baseData);
      expect(scaleMin).toBe(85);
      expect(scaleMax).toBe(215);
    });

    it("should calculate the correct domain when last_close is out of bounds", () => {
      const { scaleMin, scaleMax } = calculateScaleDomain(outOfBoundsData);
      expect(scaleMin).toBe(77.5);
      expect(scaleMax).toBe(272.5);
    });

    it("should add fixed padding when there is no price range", () => {
      const data = {
        low: 100,
        mean: 100,
        high: 100,
        last_close: 100,
        name: "Test",
        symbol: "TEST",
        logo_url: "https://example.com/logo.png",
      };
      const { scaleMin, scaleMax } = calculateScaleDomain(data);
      expect(scaleMin).toBe(90);
      expect(scaleMax).toBe(110);
    });
  });

  describe("prepareChartPoints", () => {
    const scale = scaleLinear().domain([0, 200]).range([0, 400]);

    it("should return 4 points for the base case", () => {
      const points = prepareChartPoints(baseData, scale);
      expect(points.length).toBe(4);
      expect(points.some((p) => p.type === "Low, High, Avg")).toBe(false);
    });

    it("should return 2 points when all targets are the same", () => {
      const points = prepareChartPoints(allSameData, scale);
      expect(points.length).toBe(2);
      expect(points.some((p) => p.type === "Low, High, Avg")).toBe(true);
      expect(points.some((p) => p.type === "Last Close")).toBe(true);
    });
  });

  describe("applyLabelCollision", () => {
    it("should not adjust yLevel for points that are far apart", () => {
      const points = [{ x: 50 }, { x: 150 }, { x: 250 }];
      const result = applyLabelCollision(points as any, 60);
      expect(result.map((p) => p.yLevel)).toEqual([0, 0, 0]);
    });

    it("should alternate yLevel for points that are too close", () => {
      const points = [{ x: 50 }, { x: 80 }, { x: 110 }, { x: 200 }];
      const result = applyLabelCollision(points as any, 40);

      expect(result.map((p) => p.yLevel)).toEqual([0, 1, 0, 0]);
    });

    it("should handle a sequence of overlapping points", () => {
      const points = [{ x: 50 }, { x: 70 }, { x: 90 }, { x: 110 }];
      const result = applyLabelCollision(points as any, 30);
      expect(result.map((p) => p.yLevel)).toEqual([0, 1, 0, 1]);
    });
  });
});
