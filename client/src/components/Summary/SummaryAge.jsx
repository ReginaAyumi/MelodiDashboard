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
import ChildCareIcon from "@mui/icons-material/ChildCare";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import PersonIcon from "@mui/icons-material/Person";
import ElderlyIcon from "@mui/icons-material/Elderly";
import { ResponsiveBar } from "@nivo/bar";
import { useStateContextAge } from "state/StateContextAge";

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

const SummaryAge = () => {
  const theme = useTheme();
  const { state, dispatch } = useStateContextAge();
  const { ageData, isLoading, error } = state;
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [selectedMetric, setSelectedMetric] = useState("average");
  const [isExpanded, setIsExpanded] = useState(false);

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
      const dateA = new Date(a._id.split("/").reverse().join("-"));
      const dateB = new Date(b._id.split("/").reverse().join("-"));
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

  const sortedData = useMemo(() => {
    return [...ageData].sort((a, b) => {
      const dateA = new Date(a._id.split("/").reverse().join("-"));
      const dateB = new Date(b._id.split("/").reverse().join("-"));
      return dateA - dateB;
    });
  }, [ageData]);

  const totalAnak = ageData.reduce((sum, item) => sum + item.totalAnak, 0);
  const totalRemaja = ageData.reduce((sum, item) => sum + item.totalRemaja, 0);
  const totalDewasa = ageData.reduce((sum, item) => sum + item.totalDewasa, 0);
  const totalLansia = ageData.reduce((sum, item) => sum + item.totalLansia, 0);
  const totalDays = ageData.length;
  const avgAnak = totalDays > 0 ? (totalAnak / totalDays).toFixed(2) : 0;
  const avgRemaja = totalDays > 0 ? (totalRemaja / totalDays).toFixed(2) : 0;
  const avgDewasa = totalDays > 0 ? (totalDewasa / totalDays).toFixed(2) : 0;
  const avgLansia = totalDays > 0 ? (totalLansia / totalDays).toFixed(2) : 0;

  const latestDay = sortedData[sortedData.length - 1] || {};
  const latestAnak = latestDay.totalAnak || 0;
  const latestRemaja = latestDay.totalRemaja || 0;
  const latestDewasa = latestDay.totalDewasa || 0;
  const latestLansia = latestDay.totalLansia || 0;

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  const renderMetrics = () => {
    switch (selectedMetric) {
      case "average":
        return (
          <>
            <Card
              title="Average Anak"
              value={avgAnak}
              icon={ChildCareIcon}
              theme={theme}
            />
            <Card
              title="Average Remaja"
              value={avgRemaja}
              icon={EmojiPeopleIcon}
              theme={theme}
            />
            <Card
              title="Average Dewasa"
              value={avgDewasa}
              icon={PersonIcon}
              theme={theme}
            />
            <Card
              title="Average Lansia"
              value={avgLansia}
              icon={ElderlyIcon}
              theme={theme}
            />
          </>
        );
      case "latest":
        return (
          <>
            <Card
              title="Latest Anak"
              value={latestAnak}
              icon={ChildCareIcon}
              theme={theme}
            />
            <Card
              title="Latest Remaja"
              value={latestRemaja}
              icon={EmojiPeopleIcon}
              theme={theme}
            />
            <Card
              title="Latest Dewasa"
              value={latestDewasa}
              icon={PersonIcon}
              theme={theme}
            />
            <Card
              title="Latest Lansia"
              value={latestLansia}
              icon={ElderlyIcon}
              theme={theme}
            />
          </>
        );
      case "total":
        return (
          <>
            <Card
              title="Total Anak"
              value={totalAnak}
              icon={ChildCareIcon}
              theme={theme}
            />
            <Card
              title="Total Remaja"
              value={totalRemaja}
              icon={EmojiPeopleIcon}
              theme={theme}
            />
            <Card
              title="Total Dewasa"
              value={totalDewasa}
              icon={PersonIcon}
              theme={theme}
            />
            <Card
              title="Total Lansia"
              value={totalLansia}
              icon={ElderlyIcon}
              theme={theme}
            />
          </>
        );
      default:
        return null;
    }
  };

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
          Summary Age
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
                    title="Average Anak"
                    value={avgAnak}
                    icon={ChildCareIcon}
                    theme={theme}
                  />
                  <Card
                    title="Average Remaja"
                    value={avgRemaja}
                    icon={EmojiPeopleIcon}
                    theme={theme}
                  />
                  <Card
                    title="Average Dewasa"
                    value={avgDewasa}
                    icon={PersonIcon}
                    theme={theme}
                  />
                  <Card
                    title="Average Lansia"
                    value={avgLansia}
                    icon={ElderlyIcon}
                    theme={theme}
                  />
                </>
              )}
              {selectedMetric !== "latest" && (
                <>
                  <Card
                    title="Latest Anak"
                    value={latestAnak}
                    icon={ChildCareIcon}
                    theme={theme}
                  />
                  <Card
                    title="Latest Remaja"
                    value={latestRemaja}
                    icon={EmojiPeopleIcon}
                    theme={theme}
                  />
                  <Card
                    title="Latest Dewasa"
                    value={latestDewasa}
                    icon={PersonIcon}
                    theme={theme}
                  />
                  <Card
                    title="Latest Lansia"
                    value={latestLansia}
                    icon={ElderlyIcon}
                    theme={theme}
                  />
                </>
              )}
              {selectedMetric !== "total" && (
                <>
                  <Card
                    title="Total Anak (Per Week)"
                    value={totalAnak}
                    icon={ChildCareIcon}
                    theme={theme}
                  />
                  <Card
                    title="Total Remaja (Per Week)"
                    value={totalRemaja}
                    icon={EmojiPeopleIcon}
                    theme={theme}
                  />
                  <Card
                    title="Total Dewasa (Per Week)"
                    value={totalDewasa}
                    icon={PersonIcon}
                    theme={theme}
                  />
                  <Card
                    title="Total Lansia (Per Week)"
                    value={totalLansia}
                    icon={ElderlyIcon}
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

export default SummaryAge;
