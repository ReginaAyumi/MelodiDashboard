import { useState, useEffect } from "react";
import React from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Button,
  Typography,
  Rating,
  useTheme,
  useMediaQuery,
  TextField,
} from "@mui/material";
import { useGetFeedbacksQuery } from "state/api";
import Header from "components/Header";

const Feedback = ({
  _id,
  visitorId,
  feedbackDate,
  categories,
  feedbackContent,
  rating,
}) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card
      sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.75rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s",
        "&:hover": {
          transform: "scale(1.02)",
        },
      }}
    >
      <CardContent sx={{ paddingBottom: "0" }}>
        <Typography variant="h6" component="div" gutterBottom>
          {new Date(feedbackDate).toLocaleDateString()}
        </Typography>
        <Rating value={rating} readOnly />
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          {categories}
        </Typography>
        <Typography variant="body2" gutterBottom>
          Feedback:
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {feedbackContent}
        </Typography>
      </CardContent>
      <CardActions sx={{ padding: "16px" }}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "See Less" : "See More"}
        </Button>
      </CardActions>
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ paddingTop: "0", paddingBottom: "16px" }}>
          <Typography variant="body2" color="textSecondary">
            Visitor ID: {visitorId}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};

const Feedbacks = () => {
  const { data, isLoading } = useGetFeedbacksQuery();
  const isNotMobile = useMediaQuery("(min-width: 1000px)");
  const [filterCategory, setFilterCategory] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  const handleFilter = (category) => {
    if (filterCategory === category) {
      setFilterCategory(null); // Toggle off if same category clicked again
    } else {
      setFilterCategory(category);
    }
  };

  useEffect(() => {
    if (data) {
      let feedbackData = data;

      // Filter by category
      if (filterCategory) {
        feedbackData = feedbackData.filter(
          (feedback) => feedback.categories === filterCategory
        );
      }

      // Filter by date range
      if (startDate && endDate) {
        feedbackData = feedbackData.filter(({ feedbackDate }) => {
          const date = new Date(feedbackDate);
          return date >= new Date(startDate) && date <= new Date(endDate);
        });
      }

      setFilteredData(feedbackData);
    }
  }, [data, filterCategory, startDate, endDate]);

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="FEEDBACKS" subtitle="Melihat feedback dari pengunjung." />
      <Box mt="20px" display="flex" gap="10px" alignItems="center">
        {/* Date range input */}
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
      </Box>
      <Box mt="20px">
        {/* Filter buttons */}
        <Button
          variant={filterCategory === null ? "contained" : "outlined"}
          onClick={() => handleFilter(null)}
          sx={{ marginRight: "10px" }}
        >
          All
        </Button>
        <Button
          variant={filterCategory === "Feedback Informasi" ? "contained" : "outlined"}
          onClick={() => handleFilter("Feedback Informasi")}
          sx={{ marginRight: "10px" }}
        >
          Feedback Informasi
        </Button>
        <Button
          variant={filterCategory === "Feedback Tempat Makan" ? "contained" : "outlined"}
          onClick={() => handleFilter("Feedback Tempat Makan")}
          sx={{ marginRight: "10px" }}
        >
          Feedback Tempat Makan
        </Button>
        <Button
          variant={filterCategory === "Feedback Pelayanan Petugas" ? "contained" : "outlined"}
          onClick={() => handleFilter("Feedback Pelayanan Petugas")}
          sx={{ marginRight: "10px" }}
        >
          Feedback Pelayanan Petugas
        </Button>
        <Button
          variant={filterCategory === "Feedback Robot" ? "contained" : "outlined"}
          onClick={() => handleFilter("Feedback Robot")}
          sx={{ marginRight: "10px" }}
        >
          Feedback Robot
        </Button>
        {/* Add more buttons for other categories */}
      </Box>
      {/* Check if filteredData exists before mapping */}
      {filteredData.length > 0 || !isLoading ? (
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
              <Feedback
                key={_id}
                _id={_id}
                visitorId={visitorId}
                feedbackDate={feedbackDate}
                categories={categories}
                feedbackContent={feedbackContent}
                rating={rating}
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

export default Feedbacks;
