import React, { useEffect } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  useTheme,
  Grid,
} from '@mui/material';
import { ResponsiveBar } from '@nivo/bar';
import { useStateContextGender } from 'state/StateContextGender';

const SummaryGender = () => {
  const theme = useTheme();
  const { state, dispatch } = useStateContextGender();
  const { genderData, isLoading, error } = state;

  useEffect(() => {
    const socketGender = new WebSocket('ws://localhost:5001/genderdailies');

    socketGender.onopen = () => {
      console.log('WebSocket connection opened for summary gender data');
      socketGender.send(JSON.stringify({ type: 'INITIAL_DAILY_GENDER_DATA' }));
    };

    socketGender.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'INITIAL_DATA' || message.type === 'DATA') {
        dispatch({
          type: 'SET_GENDER_DATA',
          payload: message.payload.genderdaily || [],
        });
      }
    };

    socketGender.onerror = (error) => {
      console.error('WebSocket error:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: 'Failed to fetch gender data. Please try again later.',
      });
    };

    socketGender.onclose = () => {
      console.log('WebSocket connection closed for summary gender data.');
    };

    return () => {
      if (socketGender.readyState === WebSocket.OPEN) {
        socketGender.close();
      }
    };
  }, [dispatch]);

  const processDataForBarChart = () => {
    const sortedData = [...genderData].sort((a, b) => {
      const dateA = new Date(a._id.split('/').reverse().join('-'));
      const dateB = new Date(b._id.split('/').reverse().join('-'));
      return dateA - dateB;
    });

    return sortedData.map((item, index) => ({
      _id: item._id,
      day: `Day ${index + 1}`,
      Pria: item.totalPria,
      Wanita: item.totalWanita,
    }));
  };

  const totalPria = genderData.reduce((sum, item) => sum + item.totalPria, 0);
  const totalWanita = genderData.reduce(
    (sum, item) => sum + item.totalWanita,
    0
  );
  const totalDays = genderData.length;
  const avgPria = totalDays > 0 ? (totalPria / totalDays).toFixed(2) : 0;
  const avgWanita = totalDays > 0 ? (totalWanita / totalDays).toFixed(2) : 0;

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Typography variant="h6" align="center" gutterBottom>
        Summary Gender
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Box
            bgcolor={theme.palette.primary.main}
            color={theme.palette.primary.contrastText}
            p={2}
            borderRadius={2}
            textAlign="center"
            height="100%"
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            <Typography variant="subtitle1">Rata-rata Gender/Hari</Typography>
            <Typography variant="body1">Pria: {avgPria}</Typography>
            <Typography variant="body1">Wanita: {avgWanita}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box
            bgcolor={theme.palette.primary.main}
            color={theme.palette.primary.contrastText}
            p={2}
            borderRadius={2}
            textAlign="center"
            height="100%"
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            <Typography variant="subtitle1">Gender/Hari (Terbaru)</Typography>
            {genderData.length > 0 ? (
              <>
                <Typography variant="body1">
                  Pria: {genderData[genderData.length - 1].totalPria}
                </Typography>
                <Typography variant="body1">
                  Wanita: {genderData[genderData.length - 1].totalWanita}
                </Typography>
              </>
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
            <Typography variant="subtitle1">
              Total Gender (Per Minggu)
            </Typography>
            <Typography variant="body1">Pria: {totalPria}</Typography>
            <Typography variant="body1">Wanita: {totalWanita}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" align="center" gutterBottom>
            Chart Gender Mingguan
          </Typography>
          <Box
            height={300}
            border="1px solid #ccc"
            borderRadius="4px"
            boxShadow={2}
          >
            <ResponsiveBar
              data={processDataForBarChart()}
              keys={['Pria', 'Wanita']}
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

export default SummaryGender;
