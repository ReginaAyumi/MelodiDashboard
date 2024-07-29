import { useState, useEffect } from "react";
import React from "react";
import {
  Box,
  Card,
  Typography,
  Rating,
  useTheme,
  useMediaQuery,
  Skeleton,
  TextField,
  Button,
} from "@mui/material";
import { useGetFeedbacksQuery } from "state/api";
import Header from "components/Header";

const OverallFeedback = () => {
  const theme = useTheme();
  const { data, isLoading } = useGetFeedbacksQuery();
  const isNotMobile = useMediaQuery("(min-width: 1000px)");
  const [averageFeedbackByCategory, setAverageFeedbackByCategory] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    if (data) {
      const feedbackByCategory = {};
      
      // Filter data by date range if both dates are selected
      const filteredData = startDate && endDate
        ? data.filter(({ feedbackDate }) => {
            const date = new Date(feedbackDate);
            return date >= new Date(startDate) && date <= new Date(endDate);
          })
        : data;

      // Aggregate feedback by category
      filteredData.forEach(({ categories, rating }) => {
        if (!feedbackByCategory[categories]) {
          feedbackByCategory[categories] = [];
        }
        feedbackByCategory[categories].push(rating);
      });

      // Calculate average rating for each category
      const averageByCategory = {};
      Object.keys(feedbackByCategory).forEach((category) => {
        const ratings = feedbackByCategory[category];
        const averageRating =
          ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
        averageByCategory[category] = averageRating.toFixed(1); // Round to 1 decimal place
      });

      setAverageFeedbackByCategory(averageByCategory);
    }
  }, [data, startDate, endDate]);

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="OVERALL FEEDBACK"
        subtitle="Melihat rata-rata feedback dari pengunjung."
      />
      {/* Date range input */}
      <Box mt="20px" display="flex" gap="10px" alignItems="center">
        <TextField
          label="Start Date"
          type="date"
          value={startDate ? startDate.toISOString().split("T")[0] : ""}
          onChange={(e) => setStartDate(new Date(e.target.value))}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate ? endDate.toISOString().split("T")[0] : ""}
          onChange={(e) => setEndDate(new Date(e.target.value))}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            if (startDate && endDate) {
              setAverageFeedbackByCategory({});
            }
          }}
        >
          Filter
        </Button>
      </Box>
      {/* Display average ratings by category */}
      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
        gap="20px"
      >
        {Object.keys(averageFeedbackByCategory).map((category) => (
          <Card
            key={category}
            sx={{
              p: "1rem",
              borderRadius: "0.55rem",
              backgroundColor: theme.palette.background.alt,
            }}
          >
            <Typography variant="h6">{category}</Typography>
            <Rating
              value={parseFloat(averageFeedbackByCategory[category])}
              readOnly
            />
          </Card>
        ))}
      </Box>
      {isLoading && (
        <Box mt="20px">
          {[...Array(4)].map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              width="100%"
              height={118}
              sx={{ mt: "10px", borderRadius: "0.55rem" }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default OverallFeedback;
