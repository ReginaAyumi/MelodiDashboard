import React, { useState } from "react";
import { Box, Grid, Button } from "@mui/material";
import Header from "components/Header";
import { StateProviderAge } from "state/StateContextAge";
import { StateProviderGender } from "state/StateContextGender";
import { StateProviderExpression } from "state/StateContextExpression";
import SummaryAge from "components/Summary/SummaryAge";
import SummaryGender from "components/Summary/SummaryGender";
import SummaryExpression from "components/Summary/SummaryExpression";

const Dashboard = () => {
  const [selectedSummary, setSelectedSummary] = useState("age");

  const handleSummaryChange = (summaryType) => {
    setSelectedSummary(summaryType);
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="Dashboard"
        subtitle="Selamat datang di Dashboard Analitik kami"
      />
      <Box mt="20px">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box display="grid" gridTemplateColumns="repeat(5, auto)" gap="10px">
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSummaryChange("age")}
                style={{
                  opacity: selectedSummary === "age" ? 1 : 0.5,
                }}
              >
                Summary Usia
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSummaryChange("gender")}
                style={{
                  opacity: selectedSummary === "gender" ? 1 : 0.5,
                }}
              >
                Summary Gender
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSummaryChange("expression")}
                style={{
                  opacity: selectedSummary === "expression" ? 1 : 0.5,
                }}
              >
                Summary Ekspresi
              </Button>
              {/* <Button
                variant="contained"
                color="primary"
                onClick={() => handleSummaryChange("race")}
                style={{
                  opacity: selectedSummary === "race" ? 1 : 0.5,
                }}
              >
                Summary Ras
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSummaryChange("luggage")}
                style={{
                  opacity: selectedSummary === "luggage" ? 1 : 0.5,
                }}
              >
                Summary Bawaan
              </Button> */}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box mt="20px">
              {selectedSummary === "age" && (
                <StateProviderAge>
                  <SummaryAge />
                </StateProviderAge>
              )}
              {selectedSummary === "gender" && (
                <StateProviderGender>
                  <SummaryGender />
                </StateProviderGender>
              )}
              {selectedSummary === "expression" && (
                <StateProviderExpression>
                  <SummaryExpression />
                </StateProviderExpression>
              )}
              {/* {selectedSummary === "race" && (
                <StateProviderRace>
                  <SummaryRace />
                </StateProviderRace>
              )}
              {selectedSummary === "luggage" && (
                <StateProviderLuggage>
                  <SummaryLuggage />
                </StateProviderLuggage>
              )} */}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
