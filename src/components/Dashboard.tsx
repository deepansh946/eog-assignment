import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, CircularProgress } from '@material-ui/core';
import { useSubscription } from '@apollo/react-hooks';
import { gql } from '@apollo/client';

import { Measurement, MeasurementSub } from '../resources/interfaces';
import { metricsQuery, getDataQuery, newMeasurementsSub } from '../resources/queries';
import { inputQuery, filterData, transformData } from '../resources/lib';
import { client } from '../App';
import AppHeader from './AppHeader';
import Graph from './Graph';

const useStyles = makeStyles({
  card: {
    margin: '5% 10%',
    minWidth: '70%',
    minHeight: '70%',
  },
  taskBar: {
    backgroundColor: 'silver',
  },
  progress: {
    marginLeft: '50%',
    marginTop: '20%',
  },
});

const getMetrics = async () => {
  const res = await client.query({
    query: gql`
      ${metricsQuery}
    `,
  });
  return res.data.getMetrics;
};

const getData = async (metrics: string[]) => {
  const res = await client.query({
    query: gql`
      ${getDataQuery(inputQuery(metrics))}
    `,
  });
  return res.data.getMultipleMeasurements;
};

export default () => {
  const classes = useStyles();
  const [appLoading, setAppLoading] = useState<Boolean>(true);
  const [metrics, setMetrics] = useState<string[]>([]);
  const [selection, setSelection] = useState<(string | undefined)[]>([]);
  const [initialData, setInitialData] = useState<Plotly.Data[]>([]);
  const [filteredData, setFilteredData] = useState<Plotly.Data[]>([]);
  const { loading, data } = useSubscription<MeasurementSub>(newMeasurementsSub);
  const [prevSubData, setPrevSubData] = useState<Measurement>({ metric: '', at: 0, value: 0, unit: '' });
  const [latestData, setLatestData] = useState<Measurement[]>([]);

  useEffect(() => {
    const initialFetch = async () => {
      setAppLoading(true);
      const metricsRes = await getMetrics();

      const dataRes = await getData(metricsRes);

      const transformedData = transformData(dataRes);

      setMetrics(metricsRes);

      let initialLatestData: Measurement[] = [];
      metricsRes.forEach((metric: string) => {
        initialLatestData.push({ metric: metric, at: 0, value: 0, unit: '' });
      });
      setLatestData(initialLatestData);

      setInitialData(transformedData);
      setAppLoading(false);
    };
    initialFetch();
  }, []);

  useEffect(() => {
    const filteredDataValue = filterData(initialData, selection);
    setFilteredData(filteredDataValue);
  }, [initialData, selection]);

  useEffect(() => {
    if (
      !loading &&
      (data?.newMeasurement.metric !== prevSubData.metric ||
        data.newMeasurement.value !== prevSubData.value ||
        data.newMeasurement.at !== prevSubData.at)
    ) {
      let measurementNode = data?.newMeasurement;
      let set = initialData.find(metricNode => metricNode.name === measurementNode?.metric);
      if (set && measurementNode) {
        (set.x as Plotly.Datum[]).push(new Date(measurementNode.at));
        (set.y as Plotly.Datum[]).push(measurementNode.value);
        const updatedData = initialData.map(metricNode => {
          if (metricNode.name === measurementNode?.metric) {
            return set;
          } else {
            return metricNode;
          }
        });
        setInitialData(updatedData as Plotly.Data[]);
        if (data) {
          let newData = latestData.map(measurement => {
            return measurement.metric === data.newMeasurement.metric ? data.newMeasurement : measurement;
          });
          setLatestData(newData);

          setPrevSubData(data.newMeasurement);
        }
      }
    }
  }, [initialData, loading, data, prevSubData, latestData]);

  return (
    <Card className={classes.card}>
      {appLoading ? (
        <CircularProgress className={classes.progress} />
      ) : (
        <>
          <AppHeader metrics={metrics} selection={selection} setSelection={setSelection} latestData={latestData} />
          <CardContent style={{ padding: 0 }}>
            <Graph data={filteredData} />
          </CardContent>
        </>
      )}
    </Card>
  );
};
