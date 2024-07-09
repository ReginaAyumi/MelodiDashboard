import React, { useEffect } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  useTheme,
  Grid,
} from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { useStateContextLuggage } from "state/StateContextLuggage"; // Assumes you have a context for luggage data

const SummaryLuggage = () => {
  const theme = useTheme();
  const { state, dispatch } = useStateContextLuggage();
  const { luggageData, isLoading, error } = state;

  useEffect(() => {
    const socketLuggage = new WebSocket("ws://localhost:5001/luggagedailies");

    socketLuggage.onopen = () => {
      console.log("WebSocket connection opened for summary luggage data");
      socketLuggage.send(
        JSON.stringify({ type: "INITIAL_DAILY_LUGGAGE_DATA" })
      );
    };

    socketLuggage.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "INITIAL_DATA" || message.type === "DATA") {
        dispatch({
          type: "SET_LUGGAGE_DATA",
          payload: message.payload.luggagedaily || [],
        });
      }
    };

    socketLuggage.onerror = (error) => {
      console.error("WebSocket error:", error);
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to fetch luggage data. Please try again later.",
      });
    };

    socketLuggage.onclose = () => {
      console.log("WebSocket connection closed for summary luggage data.");
    };

    return () => {
      if (socketLuggage.readyState === WebSocket.OPEN) {
        socketLuggage.close();
      }
    };
  }, [dispatch]);

  const processDataForBarChart = () => {
    const sortedData = [...luggageData].sort((a, b) => {
      const dateA = new Date(a._id.split('/').reverse().join('-'));
      const dateB = new Date(b._id.split('/').reverse().join('-'));
      return dateA - dateB;
    });

    return sortedData.map((item, index) => ({
      _id: item._id,
      day: `Day ${index + 1}`,
      Manusia: item.totalManusia,
      Besar: item.totalBesar,
      Sedang: item.totalSedang,
      Kecil: item.totalKecil,
    }));
  };

  const totalManusia = luggageData.reduce(
    (sum, item) => sum + item.totalManusia,
    0
  );
  const totalBesar = luggageData.reduce(
    (sum, item) => sum + item.totalBesar,
    0
  );
  const totalSedang = luggageData.reduce(
    (sum, item) => sum + item.totalSedang,
    0
  );
  const totalKecil = luggageData.reduce(
    (sum, item) => sum + item.totalKecil,
    0
  );
  const totalDays = luggageData.length;
  const avgManusia = totalDays > 0 ? (totalManusia / totalDays).toFixed(2) : 0;
  const avgBesar = totalDays > 0 ? (totalBesar / totalDays).toFixed(2) : 0;
  const avgSedang = totalDays > 0 ? (totalSedang / totalDays).toFixed(2) : 0;
  const avgKecil = totalDays > 0 ? (totalKecil / totalDays).toFixed(2) : 0;

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Typography variant="h6" align="center" gutterBottom>
        Summary Luggage
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
            <Typography variant="subtitle1">Rata-rata Bawaan/Hari</Typography>
            <Grid container spacing={1} justifyContent="center">
              <Grid item xs={6}>
                <Typography variant="body1">Manusia: {avgManusia}</Typography>
                <Typography variant="body1">Besar: {avgBesar}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">Sedang: {avgSedang}</Typography>
                <Typography variant="body1">Kecil: {avgKecil}</Typography>
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
            <Typography variant="subtitle1">Bawaan/Hari (Terbaru)</Typography>
            {luggageData.length > 0 ? (
              <Grid container spacing={1} justifyContent="center">
                <Grid item xs={6}>
                  <Typography variant="body1">
                    Manusia: {luggageData[luggageData.length - 1].totalManusia}
                  </Typography>
                  <Typography variant="body1">
                    Besar: {luggageData[luggageData.length - 1].totalBesar}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    Sedang: {luggageData[luggageData.length - 1].totalSedang}
                  </Typography>
                  <Typography variant="body1">
                    Kecil: {luggageData[luggageData.length - 1].totalKecil}
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
            <Typography variant="subtitle1">
              Total Bawaan (Per Minggu)
            </Typography>
            <Grid container spacing={1} justifyContent="center">
              <Grid item xs={6}>
                <Typography variant="body1">Manusia: {totalManusia}</Typography>
                <Typography variant="body1">Besar: {totalBesar}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">Sedang: {totalSedang}</Typography>
                <Typography variant="body1">Kecil: {totalKecil}</Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" align="center" gutterBottom>
            Chart Bawaan Mingguan
          </Typography>
          <Box
            height={300}
            border="1px solid #ccc"
            borderRadius="4px"
            boxShadow={2}
          >
            <ResponsiveBar
              data={processDataForBarChart()}
              keys={["Manusia", "Besar", "Sedang", "Kecil"]}
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
                legend: "Number of Visitor",
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
                  itemOpacity: 1,
                  symbolSize: 20,
                  effects: [
                    {
                      on: "hover",
                      style: {
                        itemOpacity: 1,
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

export default SummaryLuggage;
