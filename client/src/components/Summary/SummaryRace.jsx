import React, { useEffect } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  useTheme,
  Grid,
} from '@mui/material';
import { ResponsiveBar } from '@nivo/bar';
import { useStateContextRace } from 'state/StateContextRace'; // Assumes you have a context for race data

const SummaryRace = () => {
  const theme = useTheme();
  const { state, dispatch } = useStateContextRace();
  const { raceData, isLoading, error } = state;

  useEffect(() => {
    const socketRace = new WebSocket('ws://localhost:5001/racedailies');

    socketRace.onopen = () => {
      console.log('WebSocket connection opened for summary race data');
      socketRace.send(JSON.stringify({ type: 'INITIAL_DAILY_RACE_DATA' }));
    };

    socketRace.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'INITIAL_DATA' || message.type === 'DATA') {
        dispatch({ type: 'SET_RACE_DATA', payload: message.payload.racedaily || [] });
      }
    };

    socketRace.onerror = (error) => {
      console.error('WebSocket error:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: 'Failed to fetch race data. Please try again later.',
      });
    };

    socketRace.onclose = () => {
      console.log('WebSocket connection closed for summary race data.');
    };

    return () => {
      if (socketRace.readyState === WebSocket.OPEN) {
        socketRace.close();
      }
    };
  }, [dispatch]);

  const processDataForBarChart = () => {
    const sortedData = [...raceData].sort((a, b) => {
      const dateA = new Date(a._id.split('/').reverse().join('-'));
      const dateB = new Date(b._id.split('/').reverse().join('-'));
      return dateA - dateB;
    });

    return sortedData.map((item, index) => ({
      _id: item._id,
      day: `Day ${index + 1}`,
      Negroid: item.totalNegroid,
      East_Asian: item.totalEastAsian,
      Indian: item.totalIndian,
      Latin: item.totalLatin,
      Middle_Eastern: item.totalMiddleEastern,
      South_East_Asian: item.totalSouthEastAsian,
      Kaukasia: item.totalKaukasia,
    }));
  };

  const totalNegroid = raceData.reduce((sum, item) => sum + item.totalNegroid, 0);
  const totalEastAsian = raceData.reduce((sum, item) => sum + item.totalEastAsian, 0);
  const totalIndian = raceData.reduce((sum, item) => sum + item.totalIndian, 0);
  const totalLatin = raceData.reduce((sum, item) => sum + item.totalLatin, 0);
  const totalMiddleEastern = raceData.reduce((sum, item) => sum + item.totalMiddleEastern, 0);
  const totalSouthEastAsian = raceData.reduce((sum, item) => sum + item.totalSouthEastAsian, 0);
  const totalKaukasia = raceData.reduce((sum, item) => sum + item.totalKaukasia, 0);
  const totalDays = raceData.length;
  const avgNegroid = totalDays > 0 ? (totalNegroid / totalDays).toFixed(2) : 0;
  const avgEastAsian = totalDays > 0 ? (totalEastAsian / totalDays).toFixed(2) : 0;
  const avgIndian = totalDays > 0 ? (totalIndian / totalDays).toFixed(2) : 0;
  const avgLatin = totalDays > 0 ? (totalLatin / totalDays).toFixed(2) : 0;
  const avgMiddleEastern = totalDays > 0 ? (totalMiddleEastern / totalDays).toFixed(2) : 0;
  const avgSouthEastAsian = totalDays > 0 ? (totalSouthEastAsian / totalDays).toFixed(2) : 0;
  const avgKaukasia = totalDays > 0 ? (totalKaukasia / totalDays).toFixed(2) : 0;

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Typography variant="h6" align="center" gutterBottom>
        Summary Race
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
            <Typography variant="subtitle1">Rata-rata Ras/Hari</Typography>
            <Grid container spacing={1} justifyContent="center">
              <Grid item xs={6}>
                <Typography variant="body1">Negroid: {avgNegroid}</Typography>
                <Typography variant="body1">East Asian: {avgEastAsian}</Typography>
                <Typography variant="body1">Indian: {avgIndian}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">Latin: {avgLatin}</Typography>
                <Typography variant="body1">Middle Eastern: {avgMiddleEastern}</Typography>
                <Typography variant="body1">South East Asian: {avgSouthEastAsian}</Typography>
                <Typography variant="body1">Kaukasia: {avgKaukasia}</Typography>
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
            <Typography variant="subtitle1">Ras/Hari (Terbaru)</Typography>
            {raceData.length > 0 ? (
              <Grid container spacing={1} justifyContent="center">
                <Grid item xs={6}>
                  <Typography variant="body1">
                    Negroid: {raceData[raceData.length - 1].totalNegroid}
                  </Typography>
                  <Typography variant="body1">
                    East Asian: {raceData[raceData.length - 1].totalEastAsian}
                  </Typography>
                  <Typography variant="body1">
                    Indian: {raceData[raceData.length - 1].totalIndian}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    Latin: {raceData[raceData.length - 1].totalLatin}
                  </Typography>
                  <Typography variant="body1">
                    Middle Eastern: {raceData[raceData.length - 1].totalMiddleEastern}
                  </Typography>
                  <Typography variant="body1">
                    South East Asian: {raceData[raceData.length - 1].totalSouthEastAsian}
                  </Typography>
                  <Typography variant="body1">
                    Kaukasia: {raceData[raceData.length - 1].totalKaukasia}
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
            <Typography variant="subtitle1">Total Ras (Per Minggu)</Typography>
            <Grid container spacing={1} justifyContent="center">
              <Grid item xs={6}>
                <Typography variant="body1">Negroid: {totalNegroid}</Typography>
                <Typography variant="body1">East Asian: {totalEastAsian}</Typography>
                <Typography variant="body1">Indian: {totalIndian}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">Latin: {totalLatin}</Typography>
                <Typography variant="body1">Middle Eastern: {totalMiddleEastern}</Typography>
                <Typography variant="body1">South East Asian: {totalSouthEastAsian}</Typography>
                <Typography variant="body1">Kaukasia: {totalKaukasia}</Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" align="center" gutterBottom>
            Chart Ras Mingguan
          </Typography>
          <Box
            height={300}
            border="1px solid #ccc"
            borderRadius="4px"
            boxShadow={2}
          >
            <ResponsiveBar
              data={processDataForBarChart()}
              keys={['Negroid', 'East_Asian', 'Indian', 'Latin', 'Middle_Eastern', 'South_East_Asian', 'Kaukasia']}
              indexBy="_id"
              margin={{ top: 50, right: 150, bottom: 50, left: 60 }}
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

export default SummaryRace;
