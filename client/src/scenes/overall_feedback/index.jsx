import { useState, useEffect } from "react";
import React from "react";
import {
  Box,
  Card,
  Typography,
  Rating,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useGetFeedbacksQuery } from "state/api";
import Header from "components/Header";

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
      }}
    >
    </Card>
  );
};

const OverallFeedback = () => {
  const theme = useTheme();
  const { data, isLoading } = useGetFeedbacksQuery();
  const isNotMobile = useMediaQuery("(min-width: 1000px)");
  const [filterCategory] = useState(null);
  const [averageFeedbackByCategory, setAverageFeedbackByCategory] = useState(
    {}
  );

  useEffect(() => {
    if (data) {
      const feedbackByCategory = {};

      // Aggregate feedback by category
      data.forEach(({ categories, rating }) => {
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
  }, [data]);

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
              <Typography variant="body1">{category}</Typography>
              <Rating
                value={parseFloat(averageFeedbackByCategory[category])}
                readOnly
              />
            </Card>
          ))}
        </Box>
      </Box>
      {/* Check if filteredData exists before mapping */}
      {(filteredData && filteredData.length > 0) || !isLoading ? (
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
          {filteredData.map(
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
          )}
        </Box>
      ) : (
        <>Loading...</>
      )}
    </Box>
  );
};

export default OverallFeedback;
