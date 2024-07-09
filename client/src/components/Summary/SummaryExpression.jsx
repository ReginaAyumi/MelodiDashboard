import React, { useEffect } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  useTheme,
  Grid,
} from '@mui/material';
import { ResponsiveBar } from '@nivo/bar';
import { useStateContextExpression } from 'state/StateContextExpression'; // Assumes you have a context for expression data

const SummaryExpression = () => {
  const theme = useTheme();
  const { state, dispatch } = useStateContextExpression();
  const { expressionData, isLoading, error } = state;

  useEffect(() => {
    const socketExpression = new WebSocket('ws://localhost:5001/expressiondailies');

    socketExpression.onopen = () => {
      console.log('WebSocket connection opened for summary expression data');
      socketExpression.send(JSON.stringify({ type: 'INITIAL_DAILY_EXPRESSION_DATA' }));
    };

    socketExpression.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'INITIAL_DATA' || message.type === 'DATA') {
        dispatch({ type: 'SET_EXPRESSION_DATA', payload: message.payload.expressiondaily || [] });
      }
    };

    socketExpression.onerror = (error) => {
      console.error('WebSocket error:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: 'Failed to fetch expression data. Please try again later.',
      });
    };

    socketExpression.onclose = () => {
      console.log('WebSocket connection closed for summary expression data.');
    };

    return () => {
      if (socketExpression.readyState === WebSocket.OPEN) {
        socketExpression.close();
      }
    };
  }, [dispatch]);

  const processDataForBarChart = () => {
    const sortedData = [...expressionData].sort((a, b) => {
      const dateA = new Date(a._id.split('/').reverse().join('-'));
      const dateB = new Date(b._id.split('/').reverse().join('-'));
      return dateA - dateB;
    });
    
    return sortedData.map((item, index) => ({
      _id: item._id,
      day: `Day ${index + 1}`,
      Marah: item.totalMarah,
      Risih: item.totalRisih,
      Takut: item.totalTakut,
      Senyum: item.totalSenyum,
      Netral: item.totalNetral,
      Sedih: item.totalSedih,
      Terkejut: item.totalTerkejut,
    }));
  };

  const totalMarah = expressionData.reduce((sum, item) => sum + item.totalMarah, 0);
  const totalRisih = expressionData.reduce((sum, item) => sum + item.totalRisih, 0);
  const totalTakut = expressionData.reduce((sum, item) => sum + item.totalTakut, 0);
  const totalSenyum = expressionData.reduce((sum, item) => sum + item.totalSenyum, 0);
  const totalNetral = expressionData.reduce((sum, item) => sum + item.totalNetral, 0);
  const totalSedih = expressionData.reduce((sum, item) => sum + item.totalSedih, 0);
  const totalTerkejut = expressionData.reduce((sum, item) => sum + item.totalTerkejut, 0);
  const totalDays = expressionData.length;
  const avgMarah = totalDays > 0 ? (totalMarah / totalDays).toFixed(2) : 0;
  const avgRisih = totalDays > 0 ? (totalRisih / totalDays).toFixed(2) : 0;
  const avgTakut = totalDays > 0 ? (totalTakut / totalDays).toFixed(2) : 0;
  const avgSenyum = totalDays > 0 ? (totalSenyum / totalDays).toFixed(2) : 0;
  const avgNetral = totalDays > 0 ? (totalNetral / totalDays).toFixed(2) : 0;
  const avgSedih = totalDays > 0 ? (totalSedih / totalDays).toFixed(2) : 0;
  const avgTerkejut = totalDays > 0 ? (totalTerkejut / totalDays).toFixed(2) : 0;

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Typography variant="h6" align="center" gutterBottom>
        Summary Expression
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Box
            bgcolor={theme.palette.primary.main}
            color={theme.palette.primary.contrastText}
            p={2}
            borderRadius={2}
            textAlign="center"
          >
            <Typography variant="subtitle1">Rata-rata Ekspresi/Hari</Typography>
            <Grid container spacing={1} justifyContent="center">
              <Grid item xs={6}>
                <Typography variant="body1">Marah: {avgMarah}</Typography>
                <Typography variant="body1">Risih: {avgRisih}</Typography>
                <Typography variant="body1">Takut: {avgTakut}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">Senyum: {avgSenyum}</Typography>
                <Typography variant="body1">Netral: {avgNetral}</Typography>
                <Typography variant="body1">Sedih: {avgSedih}</Typography>
                <Typography variant="body1">Terkejut: {avgTerkejut}</Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box
            bgcolor={theme.palette.primary.main}
            color={theme.palette.primary.contrastText}
            p={2}
            borderRadius={2}
            textAlign="center"
          >
            <Typography variant="subtitle1">Ekspresi/Hari (Terbaru)</Typography>
            {expressionData.length > 0 ? (
              <Grid container spacing={1} justifyContent="center">
                <Grid item xs={6}>
                  <Typography variant="body1">
                    Marah: {expressionData[expressionData.length - 1].totalMarah}
                  </Typography>
                  <Typography variant="body1">
                    Risih: {expressionData[expressionData.length - 1].totalRisih}
                  </Typography>
                  <Typography variant="body1">
                    Takut: {expressionData[expressionData.length - 1].totalTakut}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    Senyum: {expressionData[expressionData.length - 1].totalSenyum}
                  </Typography>
                  <Typography variant="body1">
                    Netral: {expressionData[expressionData.length - 1].totalNetral}
                  </Typography>
                  <Typography variant="body1">
                    Sedih: {expressionData[expressionData.length - 1].totalSedih}
                  </Typography>
                  <Typography variant="body1">
                    Terkejut: {expressionData[expressionData.length - 1].totalTerkejut}
                  </Typography>
                </Grid>
              </Grid>
            ) : (
              <Typography variant="body1">No data available</Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box
            bgcolor={theme.palette.primary.main}
            color={theme.palette.primary.contrastText}
            p={2}
            borderRadius={2}
            textAlign="center"
          >
            <Typography variant="subtitle1">Total Ekspresi (Per Minggu)</Typography>
            <Grid container spacing={1} justifyContent="center">
              <Grid item xs={6}>
                <Typography variant="body1">Marah: {totalMarah}</Typography>
                <Typography variant="body1">Risih: {totalRisih}</Typography>
                <Typography variant="body1">Takut: {totalTakut}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">Senyum: {totalSenyum}</Typography>
                <Typography variant="body1">Netral: {totalNetral}</Typography>
                <Typography variant="body1">Sedih: {totalSedih}</Typography>
                <Typography variant="body1">Terkejut: {totalTerkejut}</Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" align="center" gutterBottom>
            Chart Ekspresi Mingguan
          </Typography>
          <Box
            height={300}
            border="1px solid #ccc"
            borderRadius="4px"
            boxShadow={2}
          >
            <ResponsiveBar
              data={processDataForBarChart()}
              keys={['Marah', 'Risih', 'Takut', 'Senyum', 'Netral', 'Sedih', 'Terkejut']}
              indexBy="_id"
              margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
              padding={0.3}
              colors={{ scheme: 'nivo' }}
              theme={{
                axis: {
                  domain: {
                    line: {
                      stroke: theme.palette.secondary[200],
                    },
                  },
                  legend: {
                    text: {
                      fill: theme.palette.secondary[200],
                    },
                  },
                  ticks: {
                    line: {
                      stroke: theme.palette.secondary[200],
                      strokeWidth: 1,
                    },
                    text: {
                      fill: theme.palette.secondary[200],
                    },
                  },
                },
                legends: {
                  text: {
                    fill: theme.palette.secondary[200],
                  },
                },
                tooltip: {
                  container: {
                    background: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                  },
                },
              }}
              borderColor={{
                from: 'color',
                modifiers: [['darker', 1.6]],
              }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Day',
                legendPosition: 'middle',
                legendOffset: 32,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Number of Visitor',
                legendPosition: 'middle',
                legendOffset: -40,
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              animate={true}
              motionStiffness={90}
              motionDamping={15}
              tooltip={(tooltip) => (
                <div
                  style={{
                    background: theme.palette.background.alt,
                    padding: "6px 9px",
                    borderRadius: "4px",
                    boxShadow: `0px 2px 10px ${theme.palette.secondary[200]}`,
                  }}
                >
                  <Typography
                    variant="caption"
                    style={{ color: theme.palette.text.primary }}
                  >
                    {`${tooltip.id}: ${tooltip.value}`}
                  </Typography>
                </div>
              )}
              legends={[
                {
                  dataFrom: 'keys',
                  anchor: 'top-right',
                  direction: 'column',
                  justify: false,
                  translateX: 120,
                  translateY: 0,
                  itemsSpacing: 2,
                  itemWidth: 100,
                  itemHeight: 20,
                  itemDirection: 'left-to-right',
                  itemTextColor: theme.palette.secondary[200],
                  symbolSize: 20,
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemTextColor: theme.palette.secondary[400],
                      },
                    },
                  ],
                },
              ]}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SummaryExpression;
