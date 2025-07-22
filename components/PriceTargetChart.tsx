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

const CHART_PADDING = 32;
const CHART_WIDTH = screenWidth - (CHART_PADDING * 2);
const CHART_HEIGHT = 100; // Increased to accommodate labels
const LINE_Y = 50; // Center line position within SVG
const MARKER_RADIUS = 4;
const PRICE_LABEL_OFFSET_Y = 25; // Distance from line to price label
const DESC_LABEL_OFFSET_Y = 16; // Distance from price to description label
const LABEL_COLLISION_THRESHOLD = 65;
const LABEL_PADDING_X = 60; // Horizontal padding for edge labels

export const PriceTargetChart: React.FC<PriceTargetChartProps> = ({ data }) => {
  const { low, high, name } = data;

  const { scaleMin, scaleMax } = calculateScaleDomain(data);

  const priceToX = scaleLinear()
    .domain([scaleMin, scaleMax])
    .range([LABEL_PADDING_X, CHART_WIDTH - LABEL_PADDING_X]);

  const rawPoints = prepareChartPoints(data, priceToX, CHART_WIDTH);

  const points = applyLabelCollision(rawPoints, LABEL_COLLISION_THRESHOLD);

  const lineY = LINE_Y;

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Price Targets</Text>
        <View style={styles.infoIcon}>
          <Text style={styles.infoIconText}>ⓘ</Text>
        </View>
      </View>

      <View style={styles.chartArea}>
        <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
          <Line
            x1={0}
            y1={lineY}
            x2={CHART_WIDTH}
            y2={lineY}
            stroke="#E8E8E8"
            strokeWidth={10}
          />

          {points.map((p) => {
            const yDirection = p.yLevel === 0 ? -1 : 1;
            const priceY = lineY + (PRICE_LABEL_OFFSET_Y * yDirection);
            const descY = priceY + (DESC_LABEL_OFFSET_Y * yDirection);

            // Add dashed lines for Average and Last Close
            const needsDashedLine =
              p.type === "Average" || p.type === "Last Close";
            const dashedLineStartY = lineY + (MARKER_RADIUS + 1) * yDirection;
            const dashedLineEndY = priceY - (yDirection > 0 ? 3 : -3);

            return (
              <React.Fragment key={p.type}>
                {/* Dashed line connector for Average and Last Close */}
                {needsDashedLine && (
                  <Line
                    x1={p.x}
                    y1={dashedLineStartY}
                    x2={p.x}
                    y2={dashedLineEndY}
                    stroke={p.color}
                    strokeWidth={1}
                    strokeDasharray="2 2"
                  />
                )}

                <Circle
                  cx={p.x}
                  cy={lineY}
                  r={MARKER_RADIUS}
                  fill={p.color}
                  stroke="#ffffff"
                  strokeWidth={2}
                />

                <SvgText
                  x={p.x}
                  y={priceY}
                  textAnchor="middle"
                  fontSize={14}
                  fill="#000000"
                  fontWeight="600"
                >
                  {p.value.toFixed(2)}
                </SvgText>

                <SvgText
                  x={p.x}
                  y={descY}
                  textAnchor="middle"
                  fontSize={12}
                  fill="#A8A8A8"
                  fontWeight="400"
                >
                  {p.type}
                </SvgText>
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
    paddingTop: 20,
    paddingBottom: 20,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000000",
  },
  infoIcon: {
    marginLeft: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  infoIconText: {
    fontSize: 12,
    color: "#888888",
    fontWeight: "500",
  },
  chartArea: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: CHART_HEIGHT,
    marginTop: 0,
    marginBottom: 16,
    paddingHorizontal: CHART_PADDING,
    overflow: "visible",
  },
  footer: {
    alignItems: "center",
    marginTop: 4,
  },
  footerText: {
    fontSize: 12,
    color: "#888888",
    fontWeight: "400",
  },
});
