import React, { useMemo } from 'react';
import Layout from '../Layout';
import ReactECharts from 'echarts-for-react';
import { CardOverflow, Divider, Typography, useColorScheme } from '@mui/joy';
import Random from '../../utils/Random';
import { textColors } from '../../utils/themes/charts/Dark';

export default function VolumeView({
  values,
  algorithm,
}: {
  values: [number, number][];
  algorithm: keyof typeof Random;
}) {
  const { systemMode } = useColorScheme();

  const bbox = useMemo(() => {
    if (!values.length) {
      return { x: [0, 1], y: [0, 1] };
    }
    
    const x = values.map(([x]) => x);
    const y = values.map(([, y]) => y);
    return {
      x: [Math.floor(Math.min(...x)), Math.ceil(Math.max(...x))],
      y: [Math.floor(Math.min(...y)), Math.ceil(Math.max(...y))],
    };
  }, [values]);
  
  return (
    <Layout.Tile>
      <ReactECharts
        option={{
          tooltip: {},
          visualMap: {
            show: false,
            dimension: 2,
            min: -1,
            max: 1,
            inRange: {
              color: [
                '#313695',
                '#4575b4',
                '#74add1',
                '#abd9e9',
                '#e0f3f8',
                '#ffffbf',
                '#fee090',
                '#fdae61',
                '#f46d43',
                '#d73027',
                '#a50026'
              ]
            }
          },
          xAxis3D: {
            type: 'value',
            min: bbox.x[0],
            max: bbox.x[1]
          },
          yAxis3D: {
            type: 'value',
            min: bbox.y[0],
            max: bbox.y[1]
          },
          zAxis3D: {
            type: 'value',
            splitNumber: 2
          },
          grid3D: {
            boxHeight: 40,
            axisLine: {
              lineStyle: { color: textColors[systemMode as 'dark' | 'light'] },
            },
            splitLine: {
              lineStyle: { color: textColors[systemMode as 'dark' | 'light'] },
            },
            axisPointer: {
              lineStyle: { color: textColors[systemMode as 'dark' | 'light'] }
            },
          },
          series: [
            {
              type: 'surface',
              name: 'Probability',
              wireframe: {
                show: false
              },
              shading: 'color',
              equation: {
                x: {
                  step: 0.1,
                  min: bbox.x[0],
                  max: bbox.x[1]
                },
                y: {
                  step: 0.1,
                  min: bbox.y[0],
                  max: bbox.y[1]
                },
                z: Random[algorithm].probability
              },
              itemStyle: {
                opacity: 0.3
              }
            },
            {
              type: 'scatter3D',
              name: 'Samples',
              symbolSize: 5,
              data: values.map(([x, y]) => [x, y, Random[algorithm].probability(x, y)]),
              dimensions: ['x', 'y', 'z'],
            }
          ]
        }}
        lazyUpdate
        style={{ height: '100%', width: '100%' }}
        theme={systemMode}
      />
      <CardOverflow
        variant="soft"
        sx={{
          display: 'flex',
          gap: 1.5,
          py: 1.5,
          px: 2,
          bgcolor: 'background.level1',
        }}
      >
        <Typography level="body3" sx={{ fontWeight: 'md', color: 'text.secondary' }}>
          {values.length} points
        </Typography>
        <Divider orientation="vertical" />
        <Typography level="body3" sx={{ fontWeight: 'md', color: 'text.secondary' }}>
          Three-dimensional surface plot
        </Typography>
      </CardOverflow>
    </Layout.Tile>
  );
}