export interface Measurement {
  metric: string;
  at: number;
  value: number;
  unit: string;
}

export interface MeasurementSub {
  newMeasurement: Measurement;
}

export interface MetricNode {
  metric: string;
  measurements: Measurement[];
}
