import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Svg, { Line, Circle, Text as SvgText } from "react-native-svg";
import { scaleLinear } from "d3-scale";
import { PriceTargetResponse } from "../types/api.types";
import {
  calculateScaleDomain,
  prepareChartPoints,
  applyLabelCollision,
} from "../utils/chartLogic";

interface PriceTargetChartProps {
  data: PriceTargetResponse;
}

const { width: screenWidth } = Dimensions.get("window");

const CHART_WIDTH = screenWidth - 80;
const CHART_HEIGHT = 150;
const MARKER_RADIUS = 5;
const PRICE_LABEL_OFFSET_Y = 30;
const DESC_LABEL_OFFSET_Y = 18;
const LABEL_COLLISION_THRESHOLD = 50;

export const PriceTargetChart: React.FC<PriceTargetChartProps> = ({ data }) => {
  const { low, high, name } = data;

  const { scaleMin, scaleMax } = calculateScaleDomain(data);

  const priceToX = scaleLinear()
    .domain([scaleMin, scaleMax])
    .range([0, CHART_WIDTH]);

  const rawPoints = prepareChartPoints(data, priceToX);

  const points = applyLabelCollision(rawPoints, LABEL_COLLISION_THRESHOLD);

  const lineY = CHART_HEIGHT / 2;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.companyName}>{name}</Text>
        <Text style={styles.title}>Price Targets</Text>
      </View>

      <View style={styles.chartArea}>
        <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
          <Line
            x1={0}
            y1={lineY}
            x2={CHART_WIDTH}
            y2={lineY}
            stroke="#E0E0E0"
            strokeWidth={2}
          />

          {points.map((p) => {
            const yDirection = p.yLevel === 0 ? -1 : 1;
            const priceY = lineY + PRICE_LABEL_OFFSET_Y * yDirection;
            const descY = priceY + DESC_LABEL_OFFSET_Y * yDirection;

            return (
              <React.Fragment key={p.type}>
                <SvgText
                  x={p.x}
                  y={priceY}
                  textAnchor="middle"
                  fontSize={14}
                  fill="#1A1A1A"
                  fontWeight="600"
                >
                  {p.value.toFixed(2)}
                </SvgText>

                <SvgText
                  x={p.x}
                  y={descY}
                  textAnchor="middle"
                  fontSize={12}
                  fill="#666666"
                >
                  {p.type}
                </SvgText>

                <Circle cx={p.x} cy={lineY} r={MARKER_RADIUS} fill={p.color} />
              </React.Fragment>
            );
          })}
        </Svg>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Analyst Range: ${low.toFixed(2)} - ${high.toFixed(2)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  header: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  companyName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666666",
  },
  chartArea: {
    alignItems: "center",
    justifyContent: "center",
    height: CHART_HEIGHT,
    marginTop: 20,
    marginBottom: 20,
  },
  footer: {
    marginTop: 10,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#666666",
  },
});
