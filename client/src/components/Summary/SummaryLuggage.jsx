import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { useStateContextLuggage } from "state/StateContextLuggage"; // Assumes you have a context for luggage data

const Card = ({ title, value, theme }) => (
  <Paper
    sx={{
      width: 250,
      height: 100,
      p: 2,
      borderRadius: 2,
      backgroundColor: theme.palette.background.alt,
      boxShadow: "0 0 10px 0 rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      m: 1,
      color: theme.palette.getContrastText(theme.palette.background.alt),
    }}
  >
    <Box>
      <Typography variant="subtitle2">{title}</Typography>
      <Typography variant="h5" fontWeight="bold">
        {value}
      </Typography>
    </Box>
  </Paper>
);

const SummaryLuggage = () => {
  const theme = useTheme();
  const { state, dispatch } = useStateContextLuggage();
  const { luggageData, isLoading, error } = state;

  const [selectedMetric, setSelectedMetric] = useState("average");
  const [isExpanded, setIsExpanded] = useState(false);

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
      const dateA = new Date(a._id.split("/").reverse().join("-"));
      const dateB = new Date(b._id.split("/").reverse().join("-"));
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

  const latestDay = luggageData[luggageData.length - 1] || {};
  const latestManusia = latestDay.totalManusia || 0;
  const latestBesar = latestDay.totalBesar || 0;
  const latestSedang = latestDay.totalSedang || 0;
  const latestKecil = latestDay.totalKecil || 0;

  const renderMetrics = () => {
    switch (selectedMetric) {
      case "average":
        return (
          <>
            <Card title="Average Manusia" value={avgManusia} theme={theme} />
            <Card title="Average Besar" value={avgBesar} theme={theme} />
            <Card title="Average Sedang" value={avgSedang} theme={theme} />
            <Card title="Average Kecil" value={avgKecil} theme={theme} />
          </>
        );
      case "latest":
        return (
          <>
            <Card title="Latest Manusia" value={latestManusia} theme={theme} />
            <Card title="Latest Besar" value={latestBesar} theme={theme} />
            <Card title="Latest Sedang" value={latestSedang} theme={theme} />
            <Card title="Latest Kecil" value={latestKecil} theme={theme} />
          </>
        );
      case "total":
        return (
          <>
            <Card title="Total Manusia" value={totalManusia} theme={theme} />
            <Card title="Total Besar" value={totalBesar} theme={theme} />
            <Card title="Total Sedang" value={totalSedang} theme={theme} />
            <Card title="Total Kecil" value={totalKecil} theme={theme} />
          </>
        );
      default:
        return null;
    }
  };

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} display="flex" justifyContent="left">
        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel>Metric</InputLabel>
          <Select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            label="Metric"
          >
            <MenuItem value="average">Average</MenuItem>
            <MenuItem value="latest">Latest</MenuItem>
            <MenuItem value="total">Total</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h4" align="center" gutterBottom>
          Summary Race
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container justifyContent="center">
          {renderMetrics()}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ height: 400 }}>
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
      </Grid>
    </Grid>
  );
};

export default SummaryLuggage;
