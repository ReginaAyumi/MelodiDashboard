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
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngry,
  faSmile,
  faFrownOpen,
  faMeh,
  faMehBlank,
  faSadTear,
  faSurprise,
} from "@fortawesome/free-solid-svg-icons";
import { ResponsiveBar } from "@nivo/bar";
import { useStateContextExpression } from "state/StateContextExpression"; // Assumes you have a context for expression data

const Card = ({ title, value, icon: IconComponent, theme }) => (
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
  {IconComponent && (
    <Box sx={{ marginRight: 2 }}>
      <FontAwesomeIcon icon={IconComponent} size="3x" />
    </Box>
  )}
  <Box>
    <Typography variant="subtitle2">{title}</Typography>
    <Typography variant="h5" fontWeight="bold">
      {value}
    </Typography>
  </Box>
</Paper>
);

const SummaryExpression = () => {
  const theme = useTheme();
  const { state, dispatch } = useStateContextExpression();
  const { expressionData, isLoading, error } = state;
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [selectedMetric, setSelectedMetric] = useState("average");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const socketExpression = new WebSocket("ws://localhost:5001/expressiondailies");

    socketExpression.onopen = () => {
      console.log("WebSocket connection opened for summary expression data");
      socketExpression.send(JSON.stringify({ type: "INITIAL_DAILY_EXPRESSION_DATA" }));
    };

    socketExpression.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "INITIAL_DATA" || message.type === "DATA") {
        dispatch({ type: "SET_EXPRESSION_DATA", payload: message.payload.expressiondaily || [] });
      }
    };

    socketExpression.onerror = (error) => {
      console.error("WebSocket error:", error);
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to fetch expression data. Please try again later.",
      });
    };

    socketExpression.onclose = () => {
      console.log("WebSocket connection closed for summary expression data.");
    };

    return () => {
      if (socketExpression.readyState === WebSocket.OPEN) {
        socketExpression.close();
      }
    };
  }, [dispatch]);

  const processDataForBarChart = () => {
    const sortedData = [...expressionData].sort((a, b) => {
      const dateA = new Date(a._id.split("/").reverse().join("-"));
      const dateB = new Date(b._id.split("/").reverse().join("-"));
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

  const latestDay = expressionData[expressionData.length - 1] || {};
  const latestMarah = latestDay.totalMarah || 0;
  const latestRisih = latestDay.totalRisih || 0;
  const latestTakut = latestDay.totalTakut || 0;
  const latestSenyum = latestDay.totalSenyum || 0;
  const latestNetral = latestDay.totalNetral || 0;
  const latestSedih = latestDay.totalSedih || 0;
  const latestTerkejut = latestDay.totalTerkejut || 0;

  const renderMetrics = () => {
    switch (selectedMetric) {
      case "average":
        return (
          <>
            <Card title="Average Marah" value={avgMarah} icon={faAngry} theme={theme} />
            <Card title="Average Risih" value={avgRisih} icon={faMeh} theme={theme} />
            <Card title="Average Takut" value={avgTakut} icon={faFrownOpen} theme={theme} />
            <Card title="Average Senyum" value={avgSenyum} icon={faSmile} theme={theme} />
            <Card title="Average Netral" value={avgNetral} icon={faMehBlank} theme={theme} />
            <Card title="Average Sedih" value={avgSedih} icon={faSadTear} theme={theme} />
            <Card title="Average Terkejut" value={avgTerkejut} icon={faSurprise} theme={theme} />
          </>
        );
      case "latest":
        return (
          <>
            <Card title="Latest Marah" value={latestMarah} icon={faAngry} theme={theme} />
            <Card title="Latest Risih" value={latestRisih} icon={faMeh} theme={theme} />
            <Card title="Latest Takut" value={latestTakut} icon={faFrownOpen} theme={theme} />
            <Card title="Latest Senyum" value={latestSenyum} icon={faSmile} theme={theme} />
            <Card title="Latest Netral" value={latestNetral} icon={faMehBlank} theme={theme} />
            <Card title="Latest Sedih" value={latestSedih} icon={faSadTear} theme={theme} />
            <Card title="Latest Terkejut" value={latestTerkejut} icon={faSurprise} theme={theme} />
          </>
        );
      case "total":
        return (
          <>
            <Card title="Total Marah" value={totalMarah} icon={faAngry} theme={theme} />
            <Card title="Total Risih" value={totalRisih} icon={faMeh} theme={theme} />
            <Card title="Total Takut" value={totalTakut} icon={faFrownOpen} theme={theme} />
            <Card title="Total Senyum" value={totalSenyum} icon={faSmile} theme={theme} />
            <Card title="Total Netral" value={totalNetral} icon={faMehBlank} theme={theme} />
            <Card title="Total Sedih" value={totalSedih} icon={faSadTear} theme={theme} />
            <Card title="Total Terkejut" value={totalTerkejut} icon={faSurprise} theme={theme} />
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
          Summary Expression
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container justifyContent="center">
          {renderMetrics()}
          {isExpanded && (
            <>
              {selectedMetric !== "average" && (
                <>
                  <Card title="Average Marah" value={avgMarah} icon={faAngry} theme={theme} />
                  <Card title="Average Risih" value={avgRisih} icon={faMeh} theme={theme} />
                  <Card title="Average Takut" value={avgTakut} icon={faFrownOpen} theme={theme} />
                  <Card title="Average Senyum" value={avgSenyum} icon={faSmile} theme={theme} />
                  <Card title="Average Netral" value={avgNetral} icon={faMehBlank} theme={theme} />
                  <Card title="Average Sedih" value={avgSedih} icon={faSadTear} theme={theme} />
                  <Card title="Average Terkejut" value={avgTerkejut} icon={faSurprise} theme={theme} />
                </>
              )}
              {selectedMetric !== "latest" && (
                <>
                  <Card title="Latest Marah" value={latestMarah} icon={faAngry} theme={theme} />
                  <Card title="Latest Risih" value={latestRisih} icon={faMeh} theme={theme} />
                  <Card title="Latest Takut" value={latestTakut} icon={faFrownOpen} theme={theme} />
                  <Card title="Latest Senyum" value={latestSenyum} icon={faSmile} theme={theme} />
                  <Card title="Latest Netral" value={latestNetral} icon={faMehBlank} theme={theme} />
                  <Card title="Latest Sedih" value={latestSedih} icon={faSadTear} theme={theme} />
                  <Card title="Latest Terkejut" value={latestTerkejut} icon={faSurprise} theme={theme} />
                </>
              )}
              {selectedMetric !== "total" && (
                <>
                  <Card title="Total Marah" value={totalMarah} icon={faAngry} theme={theme} />
                  <Card title="Total Risih" value={totalRisih} icon={faMeh} theme={theme} />
                  <Card title="Total Takut" value={totalTakut} icon={faFrownOpen} theme={theme} />
                  <Card title="Total Senyum" value={totalSenyum} icon={faSmile} theme={theme} />
                  <Card title="Total Netral" value={totalNetral} icon={faMehBlank} theme={theme} />
                  <Card title="Total Sedih" value={totalSedih} icon={faSadTear} theme={theme} />
                  <Card title="Total Terkejut" value={totalTerkejut} icon={faSurprise} theme={theme} />
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
            keys={[
              "Marah",
              "Risih",
              "Takut",
              "Senyum",
              "Netral",
              "Sedih",
              "Terkejut",
            ]}
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

export default SummaryExpression;
