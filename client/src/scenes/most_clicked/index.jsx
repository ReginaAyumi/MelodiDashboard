import React, { useState, useEffect } from "react";
import { Box, Card, Typography, TextField, Button, useTheme } from "@mui/material";
import { useGetClickStreamQuery } from "state/api";
import Header from "components/Header";

const MostClicked = ({ visitorId, clicks }) => {
  const theme = useTheme();
  const { data, isLoading, refetch } = useGetClickStreamQuery();
  const [mostClickedFeature, setMostClickedFeature] = useState([]);
  const [startDate, setStartDate] = useState(""); // State untuk start date
  const [endDate, setEndDate] = useState(""); // State untuk end date

  useEffect(() => {
    if (data) {
      const clickedFeature = {
        animals: 0,
        maps: 0,
        "public-facilities": 0,
        "food-store": 0,
        feedback: 0,
      };

      // Filter data based on startDate and endDate
      const filteredData = data.filter((clickStreamData) => {
        const clickDate = new Date(clickStreamData.date); // Assuming date field in clickStreamData
        if ((!startDate || clickDate >= new Date(startDate)) && (!endDate || clickDate <= new Date(endDate))) {
          return true;
        }
        return false;
      });

      // Count clicks for each feature
      filteredData.forEach((clickStreamData) => {
        clickStreamData.clicks.forEach((click) => {
          // Extract feature from visited_url
          const feature = extractFeatureFromUrl(click.visited_url);
          if (clickedFeature.hasOwnProperty(feature)) {
            clickedFeature[feature]++;
          }
        });
      });

      // Convert to array for easier mapping and sorting
      const featuresArray = Object.keys(clickedFeature).map((key) => ({
        feature: key,
        count: clickedFeature[key],
      }));

      // Sort features by count in descending order
      featuresArray.sort((a, b) => b.count - a.count);

      setMostClickedFeature(featuresArray);
    }
  }, [data, startDate, endDate]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 60000); // 10 seconds

    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, [refetch]);

  // Function to extract feature from visited_url
  const extractFeatureFromUrl = (url) => {
    const parts = url.split("/");
    if (parts.length >= 2) {
      return parts[1]; // Assuming the feature is the first part after the first slash
    }
    return "";
  };

  // Function to handle manual date filtering
  const handleFilterByDate = () => {
    // Perform filtering based on startDate and endDate
    // Example: Fetch data with startDate and endDate parameters
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="MOST CLICKED FEATURES"
        subtitle="Melihat fitur utama yang paling banyak dipilih oleh pengunjung."
      />
      {/* Filter Tanggal Manual */}
      {/* <Box mt="20px" display="flex" alignItems="center">
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ mr: "10px" }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ mr: "10px" }}
        />
        <Button variant="contained" onClick={handleFilterByDate}>
          Filter
        </Button>
      </Box> */}
      
      {/* Render Most Clicked Features */}
      <Box mt="20px">
        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : mostClickedFeature.length > 0 ? (
          mostClickedFeature.map((feature, index) => (
            <Card
              key={index}
              sx={{
                p: "1rem",
                borderRadius: "0.55rem",
                backgroundColor: theme.palette.background.alt,
                mt: "10px",
              }}
            >
              <Typography variant="h6">{feature.feature}</Typography>
              <Typography variant="body1">Clicks: {feature.count}</Typography>
            </Card>
          ))
        ) : (
          <Typography>No data available</Typography>
        )}
      </Box>
    </Box>
  );
};

export default MostClicked;
