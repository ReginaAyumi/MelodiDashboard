import React, { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  useTheme,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { ResponsiveBar } from '@nivo/bar';
import { useStateContextRace } from 'state/StateContextRace';

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

const SummaryRace = () => {
  const theme = useTheme();
  const { state, dispatch } = useStateContextRace();
  const { raceData, isLoading, error } = state;
  const [selectedMetric, setSelectedMetric] = useState("average");

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

  const latestDay = raceData[raceData.length - 1] || {};
  const latestNegroid = latestDay.totalNegroid || 0;
  const latestEastAsian = latestDay.totalEastAsian || 0;
  const latestIndian = latestDay.totalIndian || 0;
  const latestLatin = latestDay.totalLatin || 0;
  const latestMiddleEastern = latestDay.totalMiddleEastern || 0;
  const latestSouthEastAsian = latestDay.totalSouthEastAsian || 0;
  const latestKaukasia = latestDay.totalKaukasia || 0;

  const renderMetrics = () => {
    switch (selectedMetric) {
      case "average":
        return (
          <>
            <Card title="Average Negroid" value={avgNegroid} theme={theme} />
            <Card title="Average East Asian" value={avgEastAsian} theme={theme} />
            <Card title="Average Indian" value={avgIndian} theme={theme} />
            <Card title="Average Latin" value={avgLatin} theme={theme} />
            <Card title="Average Middle Eastern" value={avgMiddleEastern} theme={theme} />
            <Card title="Average South East Asian" value={avgSouthEastAsian} theme={theme} />
            <Card title="Average Kaukasia" value={avgKaukasia} theme={theme} />
          </>
        );
      case "latest":
        return (
          <>
            <Card title="Latest Negroid" value={latestNegroid} theme={theme} />
            <Card title="Latest East Asian" value={latestEastAsian} theme={theme} />
            <Card title="Latest Indian" value={latestIndian} theme={theme} />
            <Card title="Latest Latin" value={latestLatin} theme={theme} />
            <Card title="Latest Middle Eastern" value={latestMiddleEastern} theme={theme} />
            <Card title="Latest South East Asian" value={latestSouthEastAsian} theme={theme} />
            <Card title="Latest Kaukasia" value={latestKaukasia} theme={theme} />
          </>
        );
      case "total":
        return (
          <>
            <Card title="Total Negroid" value={totalNegroid} theme={theme} />
            <Card title="Total East Asian" value={totalEastAsian} theme={theme} />
            <Card title="Total Indian" value={totalIndian} theme={theme} />
            <Card title="Total Latin" value={totalLatin} theme={theme} />
            <Card title="Total Middle Eastern" value={totalMiddleEastern} theme={theme} />
            <Card title="Total South East Asian" value={totalSouthEastAsian} theme={theme} />
            <Card title="Total Kaukasia" value={totalKaukasia} theme={theme} />
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
            keys={[
              "Negroid",
              "East_Asian",
              "Indian",
              "Latin",
              "Middle_Eastern",
              "South_East_Asian",
              "Kaukasia",
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

export default SummaryRace;
