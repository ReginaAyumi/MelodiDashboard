import React, { useEffect } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  useTheme,
  Grid,
} from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { useStateContextAge } from "state/StateContextAge";

const SummaryAge = () => {
  const theme = useTheme();
  const { state, dispatch } = useStateContextAge();
  const { ageData, isLoading, error } = state;

  useEffect(() => {
    const socketAge = new WebSocket("ws://localhost:5001/agedailies");

    socketAge.onopen = () => {
      console.log("WebSocket connection opened for summary age data");
      socketAge.send(JSON.stringify({ type: "INITIAL_DAILY_AGE_DATA" }));
    };

    socketAge.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "INITIAL_DATA" || message.type === "DATA") {
        dispatch({
          type: "SET_AGE_DATA",
          payload: message.payload.agedaily || [],
        });
      }
    };

    socketAge.onerror = (error) => {
      console.error("WebSocket error:", error);
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to fetch age data. Please try again later.",
      });
    };

    socketAge.onclose = () => {
      console.log("WebSocket connection closed for summary age data.");
    };

    return () => {
      if (socketAge.readyState === WebSocket.OPEN) {
        socketAge.close();
      }
    };
  }, [dispatch]);

  const processDataForBarChart = () => {
    const sortedData = [...ageData].sort((a, b) => {
      const dateA = new Date(a._id.split('/').reverse().join('-'));
      const dateB = new Date(b._id.split('/').reverse().join('-'));
      return dateA - dateB;
    });

    return sortedData.map((item, index) => ({
      _id: item._id,
      day: `Day ${index + 1}`,
      Anak: item.totalAnak,
      Remaja: item.totalRemaja,
      Dewasa: item.totalDewasa,
      Lansia: item.totalLansia,
    }));
  };

  const totalAnak = ageData.reduce((sum, item) => sum + item.totalAnak, 0);
  const totalRemaja = ageData.reduce((sum, item) => sum + item.totalRemaja, 0);
  const totalDewasa = ageData.reduce((sum, item) => sum + item.totalDewasa, 0);
  const totalLansia = ageData.reduce((sum, item) => sum + item.totalLansia, 0);
  const totalDays = ageData.length;
  const avgAnak = totalDays > 0 ? (totalAnak / totalDays).toFixed(2) : 0;
  const avgRemaja = totalDays > 0 ? (totalRemaja / totalDays).toFixed(2) : 0;
  const avgDewasa = totalDays > 0 ? (totalDewasa / totalDays).toFixed(2) : 0;
  const avgLansia = totalDays > 0 ? (totalLansia / totalDays).toFixed(2) : 0;

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Typography variant="h6" align="center" gutterBottom>
        Summary Age
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Box
            bgcolor={theme.palette.primary.main}
            color={theme.palette.primary.contrastText}
            p={2}
            borderRadius={2}
            textAlign="center"
          >
            <Typography variant="subtitle1">Rata-rata Umur/Hari</Typography>
            <Grid container spacing={1} justifyContent="center">
              <Grid item xs={6}>
                <Typography variant="body1">Anak: {avgAnak}</Typography>
                <Typography variant="body1">Remaja: {avgRemaja}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">Dewasa: {avgDewasa}</Typography>
                <Typography variant="body1">Lansia: {avgLansia}</Typography>
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
            <Typography variant="subtitle1">Umur/Hari (Terbaru)</Typography>
            {ageData.length > 0 ? (
              <Grid container spacing={1} justifyContent="center">
                <Grid item xs={6}>
                  <Typography variant="body1">
                    Anak: {ageData[ageData.length - 1].totalAnak}
                  </Typography>
                  <Typography variant="body1">
                    Remaja: {ageData[ageData.length - 1].totalRemaja}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    Dewasa: {ageData[ageData.length - 1].totalDewasa}
                  </Typography>
                  <Typography variant="body1">
                    Lansia: {ageData[ageData.length - 1].totalLansia}
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
            <Typography variant="subtitle1">Total Umur (Per Minggu)</Typography>
            <Grid container spacing={1} justifyContent="center">
              <Grid item xs={6}>
                <Typography variant="body1">Anak: {totalAnak}</Typography>
                <Typography variant="body1">Remaja: {totalRemaja}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">Dewasa: {totalDewasa}</Typography>
                <Typography variant="body1">Lansia: {totalLansia}</Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" align="center" gutterBottom>
            Chart Umur Mingguan
          </Typography>
          <Box
            height={300}
            border="1px solid #ccc"
            borderRadius="4px"
            boxShadow={2}
          >
            <ResponsiveBar
              data={processDataForBarChart()}
              keys={["Anak", "Remaja", "Dewasa", "Lansia"]}
              indexBy="_id"
              margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
              padding={0.3}
              colors={{ scheme: "nivo" }}
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
                from: "color",
                modifiers: [["darker", 1.6]],
              }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Day",
                legendPosition: "middle",
                legendOffset: 32,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Number of Visitors",
                legendPosition: "middle",
                legendOffset: -40,
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
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
                  dataFrom: "keys",
                  anchor: "top-right",
                  direction: "column",
                  justify: false,
                  translateX: 120,
                  translateY: 0,
                  itemsSpacing: 2,
                  itemWidth: 100,
                  itemHeight: 20,
                  itemDirection: "left-to-right",
                  itemTextColor: theme.palette.secondary[200],
                  symbolSize: 20,
                  effects: [
                    {
                      on: "hover",
                      style: {
                        itemTextColor: theme.palette.secondary[400],
                      },
                    },
                  ],
                },
              ]}
            />
          </Box>
          <Box mt="20px"></Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SummaryAge;
