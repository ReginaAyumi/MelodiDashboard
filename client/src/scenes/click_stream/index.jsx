import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import { useGetClickStreamQuery } from "state/api";
import Header from "components/Header";

const ClickStream = ({ visitorId, clicks }) => {
  const theme = useTheme();
  const { data, isLoading } = useGetClickStreamQuery();
  const [clickStreamData, setClickStreamData] = useState([]);
  const [startDate, setStartDate] = useState(""); // State untuk start date
  const [endDate, setEndDate] = useState(""); // State untuk end date
  const [page, setPage] = useState(0); // State untuk halaman saat ini
  const rowsPerPage = 5; // Jumlah baris per halaman

  useEffect(() => {
    if (data) {
      // Membuat objek untuk mengelompokkan data berdasarkan Visitor ID
      const groupedData = {};
      data.forEach((item) => {
        if (!groupedData[item.VisitorId]) {
          groupedData[item.VisitorId] = [];
        }
        groupedData[item.VisitorId].push(
          ...item.clicks.map((click) => ({
            visited_url: click.visited_url,
            clickDate: click.clickDate,
          }))
        );
      });

      // Mengubah objek menjadi array untuk diset sebagai state
      const transformedData = Object.keys(groupedData).map((visitorId) => ({
        VisitorId: visitorId,
        clicks: groupedData[visitorId],
      }));

      setClickStreamData(transformedData);
    }
  }, [data]);

  // Function to handle manual date filtering
  const handleFilterByDate = () => {
    // Perform filtering based on startDate and endDate
    // Example: Fetch data with startDate and endDate parameters
  };

  // Function to handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="CLICK STREAM"
        subtitle="Melihat jejak klik pengunjung di berbagai fitur."
      />
      {/* Filter Tanggal Manual */}
      <Box mt="20px" display="flex" alignItems="center">
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
      </Box>

      {/* Render Click Stream Data */}
      <Box mt="20px">
        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : clickStreamData.length > 0 ? (
          <Card>
            <TableContainer
              component={Paper}
              sx={{
                backgroundColor: theme.palette.background.alt,
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Visitor ID</TableCell>
                    <TableCell align="center">Visited URLs</TableCell>
                    <TableCell align="center">Click Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Menampilkan data untuk halaman saat ini */}
                  {(rowsPerPage > 0
                    ? clickStreamData.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : clickStreamData
                  ).map((item, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">{item.VisitorId}</TableCell>
                      <TableCell align="center">
                        {item.clicks.map((click, clickIndex) => (
                          <div key={clickIndex}>
                            <Typography>{click.visited_url}</Typography>
                          </div>
                        ))}
                      </TableCell>
                      <TableCell align="center">
                        {item.clicks.map((click, clickIndex) => (
                          <div key={clickIndex}>
                            <Typography>{click.clickDate}</Typography>
                          </div>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {/* Tampilan paginasi */}
            <TablePagination
              rowsPerPageOptions={[]} // Menghilangkan opsi per halaman
              component="div"
              count={clickStreamData.length} // Jumlah total data
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              sx={{
                backgroundColor: theme.palette.background.alt, // Menyesuaikan warna latar belakang
                borderTop: `0.5px solid ${theme.palette.divider}`, // Menambah garis atas
              }}
            />
          </Card>
        ) : (
          <Typography>No data available</Typography>
        )}
      </Box>
    </Box>
  );
};

export default ClickStream;
