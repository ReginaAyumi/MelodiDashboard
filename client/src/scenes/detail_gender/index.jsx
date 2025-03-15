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
  TextField,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from '@nivo/pie';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { format } from "date-fns";

const DetailGender = ({ isSidebarOpen }) => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState("Daily");
  const [startTimeFrame, setStartTimeFrame] = useState("");
  const [endTimeFrame, setEndTimeFrame] = useState("");
  const [availableTimeFrames, setAvailableTimeFrames] = useState([]);
  const [startDateTime, setStartDateTime] = useState(null); // Menyimpan objek Date untuk Start
  const [endDateTime, setEndDateTime] = useState(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:5001");

    socket.onopen = () => {
      console.log("WebSocket connection opened");
      const messageType = `INITIAL_${timeFrame.toUpperCase()}_GENDER_DATA`;
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
            payloadData = message.payload.genderdaily;
            break;
          case "Minute":
            payloadData = message.payload.genderminute;
            break;
          case "Weekly":
            payloadData = message.payload.genderweekly;
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
    setStartDateTime("");
    setEndDateTime("");
    setIsLoading(true);
  };

  const handleStartTimeFrameChange = (event) => {
    setStartTimeFrame(event.target.value);
  };

  const handleEndTimeFrameChange = (event) => {
    setEndTimeFrame(event.target.value);
  };

  const filterDataByTimeFrame = () => {
    let filteredData = [...data];

    console.log("Time Frame:", timeFrame);
    console.log("Start Time Frame:", startTimeFrame);
    console.log("End Time Frame:", endTimeFrame);
    console.log("Start DateTime Value:", startDateTime);
    console.log("End DateTime Value:", endDateTime);

    if ((startTimeFrame && endTimeFrame) || (startDateTime && endDateTime)) {
        if (timeFrame === "Weekly") {
            console.log("Filtering by Weekly");
            filteredData = data.filter(item => {
                const itemWeek = item._id; // Contoh: '2024-42'
                console.log("Item Week:", itemWeek);
                console.log("Start Week:", startTimeFrame, "End Week:", endTimeFrame);
                return itemWeek >= startTimeFrame && itemWeek <= endTimeFrame;
            });
        } else if (timeFrame === "Minute") {
          console.log("Filtering by Minute");
  
          // Konversi input ke format yang sesuai
          const startTime = format(new Date(startDateTime), "yyyy-MM-dd HH:mm"); // Output: 2024-10-20 07:55
          const endTime = format(new Date(endDateTime), "yyyy-MM-dd HH:mm"); // Output: 2024-10-20 08:55
  
          console.log("Start DateTime:", startTime);
          console.log("End DateTime:", endTime);
  
          filteredData = data.filter((item) => {
              // Konversi _id ke format yang sama
              const itemDateTime = format(new Date(item._id), "yyyy-MM-dd HH:mm");
  
              console.log("Item DateTime:", itemDateTime);
  
              // Filter berdasarkan rentang waktu
              const isWithinRange = itemDateTime >= startTime && itemDateTime <= endTime;
  
              console.log("Is Within Range:", isWithinRange);
  
              return isWithinRange;
          });
        } else {
          console.log("Filtering by Daily");
          filteredData = data.filter((item) => {
              const itemDate = new Date(item._id.split('/').reverse().join('-'));
              const startTime = new Date(startTimeFrame);
              const endTime = new Date(endTimeFrame);

              console.log("Item Date:", itemDate);
              console.log("Start Time:", startTime, "End Time:", endTime);

              return itemDate >= startTime && itemDate <= endTime;
          });
        }
    }

    console.log("Filtered Data for Chart:", filteredData);
    return sortData(filteredData);
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

    return filteredData.map((item) => ({
      _id: item._id,
      Pria: item.totalPria,
      Wanita: item.totalWanita,
    }));
  };

  const processDataForLineChart = () => {
    const filteredData = filterDataByTimeFrame();
    if (!Array.isArray(filteredData)) return [];

    const formattedData = [
      { id: "Pria", data: [] },
      { id: "Wanita", data: [] },
    ];

    filteredData.forEach((item) => {
      formattedData[0].data.push({ x: item._id, y: item.totalPria });
      formattedData[1].data.push({ x: item._id, y: item.totalWanita });
    });

    return formattedData;
  };

  const processDataForPieChart = () => {
    const filteredData = filterDataByTimeFrame();
  
    // Menghitung total untuk masing-masing kategori
    const totalWanita = filteredData.reduce((acc, item) => acc + (item.totalWanita || 0), 0);
    const totalPria = filteredData.reduce((acc, item) => acc + (item.totalPria || 0), 0);
  
    const totalKeseluruhan = totalWanita + totalPria;
  
    // Memastikan total keseluruhan tidak nol untuk menghindari pembagian dengan nol
    if (totalKeseluruhan === 0) {
      return []; // Kembali array kosong jika tidak ada data
    }
  
    return [
      { id: 'Wanita', value: totalWanita, color: '#e63946' },
      { id: 'Pria', value: totalPria, color: '#f1faee' },
    ].map(item => ({
      ...item,
      percentage: ((item.value / totalKeseluruhan) * 100).toFixed(1), // Hitung persentase
    }));
  };  

  console.log(processDataForPieChart());

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error.message}</Typography>;
  }

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="Detail Gender"
        subtitle="Berikut merupakan grafik mengenai jenis kelamin pengunjung."
      />
      <Box mt="20px"></Box>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleTimeFrameChange("Daily")}
          style={{
            marginBottom: "10px",
            opacity: timeFrame === "Daily" ? 1 : 0.5, // Opacity change based on time frame
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
            opacity: timeFrame === "Minute" ? 1 : 0.5, // Opacity change based on time frame
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
            opacity: timeFrame === "Weekly" ? 1 : 0.5, // Opacity change based on time frame
          }}
        >
          Weekly
        </Button>
      </Grid>
      {timeFrame === "Daily" && (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box mb="1rem" mt="20px" display="flex" gap="1rem">
            <DatePicker
              label="Start Date"
              value={startTimeFrame}
              onChange={(newValue) => setStartTimeFrame(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
            <DatePicker
              label="End Date"
              value={endTimeFrame}
              onChange={(newValue) => setEndTimeFrame(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
          </Box>
        </LocalizationProvider>
      )}

      {timeFrame === "Minute" && (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box display="flex" flexDirection="column" gap="1rem" mb="1rem">
            {/* Start and End DateTime Pickers */}
            <Box display="flex" gap="1rem">
              <DateTimePicker
                label="Start DateTime"
                value={startDateTime}
                onChange={(newValue) => setStartDateTime(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
              <DateTimePicker
                label="End DateTime"
                value={endDateTime}
                onChange={(newValue) => setEndDateTime(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
            </Box>
          </Box>
        </LocalizationProvider>
      )}



      {timeFrame === "Weekly" && (
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
            border={`1px solid ${theme.palette.secondary[200]}`}
            borderRadius="4px"
            boxShadow={2}
          >
            <ResponsiveBar
              data={processDataForBarChart()}
              keys={["Pria", "Wanita"]}
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
                  symbolSize: 12,
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
              margin={{ top: 50, right: 110, bottom: 50, left: 60 }} // Adjusted bottom margin for rotated labels
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
                tickRotation: 0, // Rotate labels by 45 degrees for better spacing
                legend: `${timeFrame}`,
                legendOffset: 36, // Adjusted offset to fit rotated labels
                legendPosition: "middle",
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Number of Visitors",
                legendOffset: -40,
                legendPosition: "middle",
              }}
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
              lineWidth={3}
              pointSize={10}
              pointColor={{ from: "color", modifiers: [] }}
              pointBorderWidth={2}
              pointBorderColor={{ from: "serieColor" }}
              pointLabelYOffset={-12}
              enableGridX={true}
              enableGridY={true}
              useMesh={true}
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
        
        <Grid container justifyContent="center" alignItems="center" style={{ marginTop: '30px' }}>
          <Grid item xs={12} md={6}>
            <Box
              height="50vh"
              border={`1px solid ${theme.palette.secondary[200]}`}
              borderRadius="4px"
              boxShadow={2}
            >
              <ResponsivePie
                data={processDataForPieChart()}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                colors={{ scheme: 'nivo' }}
                borderColor={{ theme: 'background' }}
                enableArcLinkLabels={true} // Mengaktifkan arcLinkLabels
                arcLinkLabel={e => `${e.id}: (${e.data.percentage}%)`} // Mengatur label untuk arcLink
                arcLabel={e => `${e.value}`} // Menampilkan jumlah dan persentase dalam arcLabel
                arcLinkLabelsTextColor={`${theme.palette.secondary[200]}`}
                arcLabelsTextStyle={{
                  fontSize: 16,  // Membesarkan teks arc labels
                  fontWeight: 'bold',  // Membuat teks arc labels bold
                }}
                arcLinkLabelsTextStyle={{
                  fontSize: 16,  // Membesarkan teks
                  fontWeight: 'bold',  // Membuat teks bold
                }}
                isInteractive={false}
                theme={{
                  axis: {
                    domain: {
                      line: {
                        stroke: theme.palette.secondary[200],
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
                }}
                legends={[
                  {
                    anchor: 'bottom',
                    direction: 'row',
                    justify: false,
                    translateX: 0,
                    translateY: 56, // Jarak vertikal dari pie chart
                    itemsSpacing: 0,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: theme.palette.secondary[200],
                    itemDirection: 'left-to-right',
                    itemOpacity: 1,
                    symbolSize: 18,
                    symbolShape: 'circle',
                    effects: [
                      {
                        on: 'hover',
                        style: {
                          itemTextColor: '#000',
                        },
                      },
                    ],
                    // Modify how the legend is rendered here
                    items: processDataForPieChart().map(item => ({
                      id: item.id,
                      label: `${item.id}: ${item.value} (${item.percentage}%)`, // Display value and percentage in legend
                      color: item.color,
                    })),
                    itemTextStyle: {
                      fontSize: 16,  // Membesarkan teks legend
                      fontWeight: 'bold',  // Membuat teks legend bold
                    },
                  },
                ]}
              />
            </Box>
          </Grid>
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
              Visitor {timeFrame} Gender Data
            </Typography>
            <TableContainer component={Paper} elevation={2}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">{timeFrame}</TableCell>
                    <TableCell align="center">Pria</TableCell>
                    <TableCell align="center">Wanita</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filterDataByTimeFrame().map((item) => (
                    <TableRow key={item._id}>
                      <TableCell align="center">{item._id}</TableCell>
                      <TableCell align="center">{item.totalPria}</TableCell>
                      <TableCell align="center">{item.totalWanita}</TableCell>
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

export default DetailGender;
