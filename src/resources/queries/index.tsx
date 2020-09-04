import { gql } from '@apollo/client';

export const metricsQuery = `
  query{
    getMetrics
  }
`;

export const getDataQuery = (inputQuery: string[]) => {
  return `
 query {
   getMultipleMeasurements(input: [${inputQuery}]){
     metric,
     measurements {
       metric,
       at,
       value,
       unit
     }
   }
 }
`;
};

export const newMeasurementsSub = gql`
  subscription {
    newMeasurement {
      metric
      at
      value
      unit
    }
  }
`;
