import React, { useState, useEffect } from "react";
import Header from "components/Header";
import {
  Box,
  useTheme,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";

const DetailRas = ({ isSidebarOpen }) => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState("Daily");
  const [startTimeFrame, setStartTimeFrame] = useState("");
  const [endTimeFrame, setEndTimeFrame] = useState("");
  const [availableTimeFrames, setAvailableTimeFrames] = useState([]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:5001");

    socket.onopen = () => {
      console.log("WebSocket connection opened");
      const messageType = `INITIAL_${timeFrame.toUpperCase()}_RACE_DATA`;
      console.log("Sending message to server:", messageType);
      socket.send(JSON.stringify({ type: messageType }));
    };

    socket.onmessage = (event) => {
      console.log("WebSocket message received:", event.data);
      const message = JSON.parse(event.data);
      if (message.type === "INITIAL_DATA" || message.type === "DATA") {
        let payloadData;
        switch (timeFrame) {
          case "Daily":
            payloadData = message.payload.racedaily;
            break;
          case "Minute":
            payloadData = message.payload.raceminute;
            break;
          case "Weekly":
            payloadData = message.payload.raceweekly;
            break;
          default:
            break;
        }

        if (payloadData) {
          setData(payloadData);
          setIsLoading(false);
          if (timeFrame === "Daily") {
            const sortedTimeFrames = payloadData.map((item) => item._id).sort((a, b) => {
              const dateA = new Date(a.split('/').reverse().join('-'));
              const dateB = new Date(b.split('/').reverse().join('-'));
              return dateA - dateB;
            });
            setAvailableTimeFrames(sortedTimeFrames);
          } else {
            setAvailableTimeFrames(payloadData.map((item) => item._id));
          }
        }
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setError(new Error("WebSocket connection error."));
      setIsLoading(false);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [timeFrame]);

  const handleTimeFrameChange = (newTimeFrame) => {
    setTimeFrame(newTimeFrame);
    setStartTimeFrame("");
    setEndTimeFrame("");
    setIsLoading(true);
  };

  const handleStartTimeFrameChange = (event) => {
    setStartTimeFrame(event.target.value);
  };

  const handleEndTimeFrameChange = (event) => {
    setEndTimeFrame(event.target.value);
  };

  const filterDataByTimeFrame = () => {
    if (timeFrame === "Daily") {
      let filteredData = [...data];
  
      if (startTimeFrame && endTimeFrame) {
        filteredData = data.filter((item) => {
          const itemDate = new Date(item._id.split('/').reverse().join('-'));
          const startDate = new Date(startTimeFrame.split('/').reverse().join('-'));
          const endDate = new Date(endTimeFrame.split('/').reverse().join('-'));
          
          return itemDate >= startDate && itemDate <= endDate;
        });
      }
  
      return sortData(filteredData);
    } else if (timeFrame === "Weekly" || timeFrame === "Minute") {
      let filteredData = [...data];
  
      if (startTimeFrame && endTimeFrame) {
        filteredData = data.filter((item) => {
          // Adjust this logic based on the actual format of _id for Weekly and Minute
          const itemDate = new Date(item._id); // Assuming _id is directly a valid date format
          const startDate = new Date(startTimeFrame);
          const endDate = new Date(endTimeFrame);
          
          return itemDate >= startDate && itemDate <= endDate;
        });
      }
  
      return filteredData;
    } else {
      return data;
    }
  };

  const sortData = (data) => {
    return [...data].sort((a, b) => {
      const dateA = new Date(a._id.split('/').reverse().join('-'));
      const dateB = new Date(b._id.split('/').reverse().join('-'));
      return dateA - dateB;
    });
  };

  const processDataForBarChart = () => {
    const filteredData = filterDataByTimeFrame();
    if (!Array.isArray(filteredData)) return [];

    // Mapping data based on timeFrame
    switch (timeFrame) {
      case "Daily":
        return filteredData.map((item) => ({
          _id: item._id,
          Negroid: item.totalNegroid,
          East_Asian: item.totalEastAsian,
          Indian: item.totalIndian,
          Latin: item.totalLatin,
          Middle_Eastern: item.totalMiddleEastern,
          South_East_Asian: item.totalSouthEastAsian,
          Kaukasia: item.totalKaukasia,
        }));
      case "Minute":
        return filteredData.map((item) => ({
          _id: item._id,
          Negroid: item.totalNegroid,
          East_Asian: item.totalEastAsian,
          Indian: item.totalIndian,
          Latin: item.totalLatin,
          Middle_Eastern: item.totalMiddleEastern,
          South_East_Asian: item.totalSouthEastAsian,
          Kaukasia: item.totalKaukasia,
        }));
      case "Weekly":
        return filteredData.map((item) => ({
          _id: item._id,
          Negroid: item.totalNegroid,
          East_Asian: item.totalEastAsian,
          Indian: item.totalIndian,
          Latin: item.totalLatin,
          Middle_Eastern: item.totalMiddleEastern,
          South_East_Asian: item.totalSouthEastAsian,
          Kaukasia: item.totalKaukasia,
        }));
      default:
        return [];
    }
  };

  const processDataForLineChart = () => {
    const filteredData = filterDataByTimeFrame();
    if (!Array.isArray(filteredData)) return [];

    const formattedData = [
      { id: "Negroid", data: [] },
      { id: "East_Asian", data: [] },
      { id: "Indian", data: [] },
      { id: "Latin", data: [] },
      { id: "Middle_Eastern", data: [] },
      { id: "South_East_Asian", data: [] },
      { id: "Kaukasia", data: [] },
    ];

    filteredData.forEach((item) => {
      formattedData[0].data.push({ x: item._id, y: item.totalNegroid });
      formattedData[1].data.push({ x: item._id, y: item.totalEastAsian });
      formattedData[2].data.push({ x: item._id, y: item.totalIndian });
      formattedData[3].data.push({ x: item._id, y: item.totalLatin });
      formattedData[4].data.push({ x: item._id, y: item.totalMiddleEastern });
      formattedData[5].data.push({
        x: item._id,
        y: item.totalSouthEastAsian,
      });
      formattedData[6].data.push({ x: item._id, y: item.totalKaukasia });
    });

    return formattedData;
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="DETAIL RAS"
        subtitle="Berikut merupakan grafik mengenai ras pengunjung."
      />
      <Box mt="20px"></Box>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleTimeFrameChange("Daily")}
          style={{
            marginBottom: "10px",
            opacity: timeFrame === "Daily" ? 1 : 0.5, // Tambahkan opacity
          }}
        >
          Daily
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleTimeFrameChange("Minute")}
          style={{
            marginBottom: "10px",
            marginLeft: "10px",
            opacity: timeFrame === "Minute" ? 1 : 0.5, // Tambahkan opacity
          }}
        >
          Minute
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleTimeFrameChange("Weekly")}
          style={{
            marginBottom: "10px",
            marginLeft: "10px",
            opacity: timeFrame === "Weekly" ? 1 : 0.5, // Tambahkan opacity
          }}
        >
          Weekly
        </Button>
      </Grid>
      {timeFrame && (
        <Box mb="1rem" mt="20px" display="flex" gap="1rem">
          <FormControl fullWidth>
            <InputLabel id="start-timeframe-label">
              Start {timeFrame}
            </InputLabel>
            <Select
              labelId="start-timeframe-label"
              id="start-timeframe-select"
              value={startTimeFrame}
              label={`Start ${timeFrame}`}
              onChange={handleStartTimeFrameChange}
            >
              {availableTimeFrames.map((frame) => (
                <MenuItem key={frame} value={frame}>
                  {frame}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="end-timeframe-label">End {timeFrame}</InputLabel>
            <Select
              labelId="end-timeframe-label"
              id="end-timeframe-select"
              value={endTimeFrame}
              label={`End ${timeFrame}`}
              onChange={handleEndTimeFrameChange}
            >
              {availableTimeFrames.map((frame) => (
                <MenuItem key={frame} value={frame}>
                  {frame}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box
            height="50vh"
            width="100%"
            border={`1px solid ${theme.palette.secondary[200]}`}
            borderRadius="4px"
          >
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
              margin={{ top: 30, right: 150, bottom: 70, left: 60 }}
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
                    color: theme.palette.primary.main,
                  },
                },
              }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 20,
                legend: `${timeFrame}`,
                legendPosition: "middle",
                legendOffset: 52,
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
              labelTextColor={{ from: "color", modifiers: [["brighter", 1.6]] }}
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
                        itemTextColor: theme.palette.secondary[200],
                      },
                    },
                  ],
                },
              ]}
              tooltip={(tooltip) => (
                <div
                style={{
                  background: theme.palette.background.alt,
                  padding: "6px 9px",
                  borderRadius: "4px",
                  boxShadow: `0px 2px 10px ${theme.palette.secondary[200]}`,
                }}
                >
                  <strong>{`${tooltip.id}: ${tooltip.value}`}</strong>
                  <br />
                  <strong>{`Time: ${tooltip.indexValue}`}</strong>
                </div>
              )}
              role="application"
              ariaLabel="Nivo bar chart demo"
              barAriaLabel={function (e) {
                return (
                  e.id +
                  ": " +
                  e.formattedValue +
                  " in country: " +
                  e.indexValue
                );
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            height="50vh"
            width="100%"
            border={`1px solid ${theme.palette.secondary[200]}`}
            borderRadius="4px"
          >
            <ResponsiveLine
              data={processDataForLineChart()}
              margin={{ top: 50, right: 150, bottom: 50, left: 60 }}
              xScale={{ type: "point" }}
              yScale={{
                type: "linear",
                min: "auto",
                max: "auto",
                stacked: true,
                reverse: false,
              }}
              yFormat=" >-.2f"
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: `${timeFrame}`,
                legendOffset: 36,
                legendPosition: "middle",
              }}
              axisLeft={{
                orient: "left",
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Number of Visitors",
                legendOffset: -40,
                legendPosition: "middle",
              }}
              colors={{ scheme: "nivo" }}
              pointSize={10}
              pointColor={{ from: "color", modifiers: [] }}
              pointBorderWidth={2}
              pointBorderColor={{ from: "serieColor" }}
              pointLabelYOffset={-12}
              useMesh={true}
              enableGridX={true} // Disable x-axis grid lines
              enableGridY={true} // Disable y-axis grid lines
              animate={true} // Enable animation
              motionConfig="gentle" // Nivo built-in animation
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
                    color: theme.palette.primary.main,
                  },
                },
              }}
              tooltip={({ point }) => (
                <div
                  style={{
                    background: theme.palette.background.alt,
                    padding: "6px 9px",
                    borderRadius: "4px",
                    boxShadow: `0px 2px 10px ${theme.palette.secondary[200]}`,
                  }}
                >
                  <strong>{`Time: ${point.data.x}`}</strong>
                  <br />
                  <strong>{`Visitors: ${point.data.y}`}</strong>
                </div>
              )}
              legends={[
                {
                  anchor: "bottom-right",
                  direction: "column",
                  justify: false,
                  translateX: 100,
                  translateY: 0,
                  itemWidth: 80,
                  itemHeight: 20,
                  itemsSpacing: 0,
                  itemDirection: "left-to-right",
                  symbolSize: 12,
                  symbolShape: "circle",
                  itemTextColor: theme.palette.secondary[200],
                  effects: [
                    {
                      on: "hover",
                      style: {
                        itemTextColor: theme.palette.primary.main,
                      },
                    },
                  ],
                },
              ]}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box
            width="100%"
            border={`1px solid ${theme.palette.secondary[200]}`}
            borderRadius="4px"
            p="16px"
            overflow="auto"
          >
            <Typography variant="h6" align="center" gutterBottom>
              Visitor {timeFrame} Race Data
            </Typography>
            <TableContainer component={Paper} elevation={2}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">{timeFrame}</TableCell>
                    <TableCell align="center">Negroid</TableCell>
                    <TableCell align="center">East_Asian</TableCell>
                    <TableCell align="center">Indian</TableCell>
                    <TableCell align="center">Latin</TableCell>
                    <TableCell align="center">Middle_Eastern</TableCell>
                    <TableCell align="center">South_East_Asian</TableCell>
                    <TableCell align="center">Kaukasia</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filterDataByTimeFrame().map((item) => (
                    <TableRow key={item._id}>
                      <TableCell align="center">{item._id}</TableCell>
                      <TableCell align="center">{item.totalNegroid}</TableCell>
                      <TableCell align="center">
                        {item.totalEastAsian}
                      </TableCell>
                      <TableCell align="center">{item.totalIndian}</TableCell>
                      <TableCell align="center">{item.totalLatin}</TableCell>
                      <TableCell align="center">
                        {item.totalMiddleEastern}
                      </TableCell>
                      <TableCell align="center">
                        {item.totalSouthEastAsian}
                      </TableCell>
                      <TableCell align="center">{item.totalKaukasia}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box mt="20px"></Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DetailRas;
