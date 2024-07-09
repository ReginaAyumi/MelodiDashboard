import { useState, useEffect } from "react";
import React from "react";
import {
  Box,
  Card,
  Typography,
  Rating,
  useTheme,
  useMediaQuery,
  Collapse,
  IconButton,
  Skeleton,
  TextField,
  Button,
} from "@mui/material";
import { useGetFeedbacksQuery } from "state/api";
import Header from "components/Header";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const FeedbackCard = ({
  _id,
  visitorId,
  feedbackDate,
  categories,
  feedbackContent,
  rating,
  isExpanded,
  setIsExpanded,
}) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.55rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: "1rem",
      }}
    >
      <Typography variant="h6">{categories}</Typography>
      <Rating value={rating} readOnly sx={{ mt: "0.5rem" }} />
      <Typography variant="body2" color="textSecondary" sx={{ mt: "0.5rem" }}>
        {new Date(feedbackDate).toLocaleDateString()}
      </Typography>
      <Typography variant="body2" sx={{ mt: "0.5rem" }}>
        {feedbackContent.substring(0, 100)}...
      </Typography>
      <IconButton
        onClick={() => setIsExpanded((prev) => !prev)}
        sx={{ alignSelf: "flex-end" }}
      >
        {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </IconButton>
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <Typography variant="body2" sx={{ mt: "1rem" }}>
          {feedbackContent}
        </Typography>
      </Collapse>
    </Card>
  );
};

const OverallFeedback = () => {
  const theme = useTheme();
  const { data, isLoading } = useGetFeedbacksQuery();
  const isNotMobile = useMediaQuery("(min-width: 1000px)");
  const [filterCategory] = useState(null);
  const [averageFeedbackByCategory, setAverageFeedbackByCategory] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    if (data && startDate && endDate) {
      const feedbackByCategory = {};

      // Filter data by date range
      const filteredData = data.filter(({ feedbackDate }) => {
        const date = new Date(feedbackDate);
        return date >= new Date(startDate) && date <= new Date(endDate);
      });

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

  // Check if data is undefined or null before filtering
  const filteredData =
    data &&
    data.filter(
      (feedback) =>
        filterCategory === null || feedback.categories === filterCategory
    );

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
      <Box mt="20px">
        <Box>
          {Object.keys(averageFeedbackByCategory).map((category) => (
            <Card
              key={category}
              sx={{
                mt: "10px",
                p: "10px",
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
      </Box>
      {/* Check if filteredData exists before mapping */}
      {isLoading ? (
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
      ) : filteredData && filteredData.length > 0 ? (
        <Box
          mt="20px"
          display="grid"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          justifyContent="space-between"
          rowGap="20px"
          columnGap="1.33%"
          sx={{
            "& > div": { gridColumn: isNotMobile ? undefined : "span 4" },
          }}
        >
          {/* {filteredData.map(
            ({
              _id,
              visitorId,
              feedbackDate,
              categories,
              feedbackContent,
              rating,
            }) => (
              <FeedbackCard
                key={_id}
                _id={_id}
                visitorId={visitorId}
                feedbackDate={feedbackDate}
                categories={categories}
                feedbackContent={feedbackContent}
                rating={rating}
                isExpanded={false} // Initially not expanded
                setIsExpanded={() => {}} // Placeholder function
              />
            )
          )} */}
        </Box>
      ) : (
        <Typography mt="20px">No feedback available.</Typography>
      )}
    </Box>
  );
};

export default OverallFeedback;
