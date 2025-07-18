// Types for chart visualization and positioning

export interface ChartDimensions {
  width: number;
  height: number;
  marginLeft: number;
  marginRight: number;
  marginTop: number;
  marginBottom: number;
}

export interface PricePoint {
  value: number;
  label: string;
  type: 'low' | 'mean' | 'high' | 'current';
}

export interface ChartScale {
  min: number;
  max: number;
  range: [number, number];
}

export interface MarkerPosition {
  x: number;
  y: number;
  value: number;
  label: string;
  labelPosition: 'above' | 'below';
}

export interface EdgeCaseScenario {
  type: 'base' | 'out_of_bounds' | 'overlapping' | 'all_same_within_50' | 'all_same_outside_50';
}