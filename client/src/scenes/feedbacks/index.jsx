import { useState } from "react";
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
        borderRadius: "0.55rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CardContent>
        <Typography variant="h5" component="div">
          {feedbackDate}
        </Typography>
        <Rating value={rating} readOnly />
        <Typography variant="body1">{categories}</Typography>
        <Typography variant="body2"> Feedback:</Typography>
        <Typography variant="body2"> {feedbackContent}</Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          size="small"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "See Less" : "See More"}
        </Button>
      </CardActions>
      <Collapse
        in={isExpanded}
        timeout="auto"
        unmountOnExit
        sx={{ color: theme.palette.neutral[300] }}
      >
        <CardContent>
          <Typography>Visitor ID: {visitorId}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};

const Feedbacks = () => {
  const { data, isLoading } = useGetFeedbacksQuery();
  const isNotMobile = useMediaQuery("(min-width: 1000px)");
  const [filterCategory, setFilterCategory] = useState(null);

  const handleFilter = (category) => {
    if (filterCategory === category) {
      setFilterCategory(null); // Toggle off if same category clicked again
    } else {
      setFilterCategory(category);
    }
  };

  // Check if data is undefined or null before filtering
  const filteredData = data && data.filter(
    (feedback) =>
      filterCategory === null || feedback.categories === filterCategory
  );

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="FEEDBACKS" subtitle="Melihat feedback dari pengunjung." />
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
      {filteredData && filteredData.length > 0 || !isLoading ? (
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
