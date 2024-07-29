import React, { useEffect, useState, useMemo } from "react";
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
  Button,
} from "@mui/material";
import ManIcon from "@mui/icons-material/Man";
import WomanIcon from "@mui/icons-material/Woman";
import { ResponsiveBar } from "@nivo/bar";
import { useStateContextGender } from "state/StateContextGender";

const Card = ({ title, value, icon: Icon, theme }) => (
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
    <Icon sx={{ fontSize: 40, color: theme.palette.secondary[200], mr: 2 }} />
    <Box>
      <Typography variant="subtitle2">{title}</Typography>
      <Typography variant="h5" fontWeight="bold">
        {value}
      </Typography>
    </Box>
  </Paper>
);

const SummaryGender = () => {
  const theme = useTheme();
  const { state, dispatch } = useStateContextGender();
  const { genderData, isLoading, error } = state;
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [selectedMetric, setSelectedMetric] = useState("average");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const socketGender = new WebSocket("ws://localhost:5001/genderdailies");

    socketGender.onopen = () => {
      console.log("WebSocket connection opened for summary gender data");
      socketGender.send(JSON.stringify({ type: "INITIAL_DAILY_GENDER_DATA" }));
    };

    socketGender.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "INITIAL_DATA" || message.type === "DATA") {
        dispatch({
          type: "SET_GENDER_DATA",
          payload: message.payload.genderdaily || [],
        });
      }
    };

    socketGender.onerror = (error) => {
      console.error("WebSocket error:", error);
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to fetch gender data. Please try again later.",
      });
    };

    socketGender.onclose = () => {
      console.log("WebSocket connection closed for summary gender data.");
    };

    return () => {
      if (socketGender.readyState === WebSocket.OPEN) {
        socketGender.close();
      }
    };
  }, [dispatch]);

  const processDataForBarChart = () => {
    const sortedData = [...genderData].sort((a, b) => {
      const dateA = new Date(a._id.split("/").reverse().join("-"));
      const dateB = new Date(b._id.split("/").reverse().join("-"));
      return dateA - dateB;
    });

    return sortedData.map((item, index) => ({
      _id: item._id,
      day: `Day ${index + 1}`,
      Pria: item.totalPria,
      Wanita: item.totalWanita,
    }));
  };

  const sortedData = useMemo(() => {
    return [...genderData].sort((a, b) => {
      const dateA = new Date(a._id.split("/").reverse().join("-"));
      const dateB = new Date(b._id.split("/").reverse().join("-"));
      return dateA - dateB;
    });
  }, [genderData]);

  const totalPria = genderData.reduce((sum, item) => sum + item.totalPria, 0);
  const totalWanita = genderData.reduce(
    (sum, item) => sum + item.totalWanita,
    0
  );
  const totalDays = genderData.length;
  const avgPria = totalDays > 0 ? (totalPria / totalDays).toFixed(2) : 0;
  const avgWanita = totalDays > 0 ? (totalWanita / totalDays).toFixed(2) : 0;

  const latestDay = sortedData[sortedData.length - 1] || {};
  const latestPria = latestDay.totalPria || 0;
  const latestWanita = latestDay.totalWanita || 0;

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  const renderMetrics = () => {
    switch (selectedMetric) {
      case "average":
        return (
          <>
            <Card
              title="Average Pria"
              value={avgPria}
              icon={ManIcon}
              theme={theme}
            />
            <Card
              title="Average Wanita"
              value={avgWanita}
              icon={WomanIcon}
              theme={theme}
            />
          </>
        );
      case "latest":
        return (
          <>
            <Card
              title="Latest Pria"
              value={latestPria}
              icon={ManIcon}
              theme={theme}
            />
            <Card
              title="Latest Wanita"
              value={latestWanita}
              icon={WomanIcon}
              theme={theme}
            />
          </>
        );
      case "total":
        return (
          <>
            <Card
              title="Total Pria"
              value={totalPria}
              icon={ManIcon}
              theme={theme}
            />
            <Card
              title="Total Wanita"
              value={totalWanita}
              icon={WomanIcon}
              theme={theme}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Grid container spacing={isSmallScreen ? 2 : 4}>
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
          Summary Gender
        </Typography>
      </Grid>
      {/* <Grid item xs={12} display="flex" justifyContent="left">
        <Button variant="contained" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? "Collapse" : "Expand"}
        </Button>
      </Grid> */}
      <Grid item xs={12}>
        <Grid container justifyContent="center">
          {renderMetrics()}
          {isExpanded && (
            <>
              {selectedMetric !== "average" && (
                <>
                  <Card
                    title="Average Pria"
                    value={avgPria}
                    icon={ManIcon}
                    theme={theme}
                  />
                  <Card
                    title="Average Wanita"
                    value={avgWanita}
                    icon={WomanIcon}
                    theme={theme}
                  />
                </>
              )}
              {selectedMetric !== "latest" && (
                <>
                  <Card
                    title="Latest Pria"
                    value={latestPria}
                    icon={ManIcon}
                    theme={theme}
                  />
                  <Card
                    title="Latest Wanita"
                    value={latestWanita}
                    icon={WomanIcon}
                    theme={theme}
                  />
                </>
              )}
              {selectedMetric !== "total" && (
                <>
                  <Card
                    title="Total Pria (Per Week)"
                    value={totalPria}
                    icon={ManIcon}
                    theme={theme}
                  />
                  <Card
                    title="Total Wanita (Per Week)"
                    value={totalWanita}
                    icon={WomanIcon}
                    theme={theme}
                  />
                </>
              )}
            </>
          )}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ height: 400 }}>
          <ResponsiveBar
            data={processDataForBarChart()}
            keys={["Pria", "Wanita"]}
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

export default SummaryGender;
