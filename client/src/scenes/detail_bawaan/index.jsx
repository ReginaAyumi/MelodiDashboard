import React, { useState, useEffect } from "react";
import Header from "components/Header";
import {
  Box,
  useTheme,
  CircularProgress,
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

const DetailBawaan = ({ isSidebarOpen }) => {
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
      const messageType = `INITIAL_${timeFrame.toUpperCase()}_LUGGAGE_DATA`;
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
            payloadData = message.payload.luggagedaily;
            break;
          case "Minute":
            payloadData = message.payload.luggageminute;
            break;
          case "Weekly":
            payloadData = message.payload.luggageweekly;
            break;
          default:
            break;
        }

        if (payloadData) {
          setData(payloadData);
          setAvailableTimeFrames(payloadData.map((item) => item._id));
          setIsLoading(false);
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
    if (!startTimeFrame || !endTimeFrame) return data;

    const startIndex = availableTimeFrames.indexOf(startTimeFrame);
    const endIndex = availableTimeFrames.indexOf(endTimeFrame);
    if (startIndex === -1 || endIndex === -1) return data;

    return data.slice(startIndex, endIndex + 1);
  };

  const processDataForBarChart = () => {
    const filteredData = filterDataByTimeFrame();
    if (!Array.isArray(filteredData)) return [];

    return filteredData.map((item) => ({
      _id: item._id,
      Manusia: item.totalManusia,
      Besar: item.totalBesar,
      Sedang: item.totalSedang,
      Kecil: item.totalKecil,
    }));
  };

  const processDataForLineChart = () => {
    const filteredData = filterDataByTimeFrame();
    if (!Array.isArray(filteredData)) return [];

    const formattedData = [
      { id: "Manusia", data: [] },
      { id: "Besar", data: [] },
      { id: "Sedang", data: [] },
      { id: "Kecil", data: [] },
    ];

    filteredData.forEach((item) => {
      formattedData[0].data.push({ x: item._id, y: item.totalManusia });
      formattedData[1].data.push({ x: item._id, y: item.totalBesar });
      formattedData[2].data.push({ x: item._id, y: item.totalSedang });
      formattedData[3].data.push({ x: item._id, y: item.totalKecil });
    });

    return formattedData;
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error.message}</Typography>;
  }

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="DETAIL BAWAAN"
        subtitle="Berikut merupakan grafik mengenai bawaan pengunjung."
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
                    color: theme.palette.primary.main,
                  },
                },
              }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: `${timeFrame}`,
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
              motionConfig="gentle" // Nivo built-in animation
              animate={true} // Enable animation
              tooltip={(tooltip) => (
                <div
                  style={{
                    padding: "12px",
                    background: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.secondary[200]}`,
                    color: theme.palette.text.primary,
                  }}
                >
                  <strong>{`${tooltip.id}: ${tooltip.value}`}</strong>
                  <br />
                  <strong>{`Time: ${tooltip.indexValue}`}</strong>
                </div>
              )}
              role="application"
              ariaLabel="Nivo bar chart demo"
              barAriaLabel={(e) =>
                `${e.id}: ${e.formattedValue} in country: ${e.indexValue}`
              }
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
              margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
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
                orient: "bottom",
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: `${timeFrame}`,
                legendOffset: 36,
                legendPosition: "middle",
                tickValues: data.map((item) => item._id),
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
              pointColor={{ theme: "background" }}
              pointBorderWidth={2}
              pointBorderColor={{ from: "serieColor" }}
              pointLabelYOffset={-12}
              useMesh={true}
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
                    padding: "12px",
                    background: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.secondary[200]}`,
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
              Visitor {timeFrame} Luggage Data
            </Typography>
            <TableContainer component={Paper} elevation={2}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">{timeFrame}</TableCell>
                    <TableCell align="center">Manusia</TableCell>
                    <TableCell align="center">Besar</TableCell>
                    <TableCell align="center">Sedang</TableCell>
                    <TableCell align="center">Kecil</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filterDataByTimeFrame().map((item) => (
                    <TableRow key={item._id}>
                      <TableCell align="center">{item._id}</TableCell>
                      <TableCell align="center">{item.totalManusia}</TableCell>
                      <TableCell align="center">{item.totalBesar}</TableCell>
                      <TableCell align="center">{item.totalSedang}</TableCell>
                      <TableCell align="center">{item.totalKecil}</TableCell>
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

export default DetailBawaan;
