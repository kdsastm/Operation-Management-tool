import React from "react";
import { Box, Typography, IconButton, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { Bar, Line } from "react-chartjs-2";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate } from "react-router-dom";

const FullViewChart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { chartData, chartOptions, chartType, title } = location.state;

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "#0A192F", color: "white", minHeight: "100vh" }}>
      <IconButton sx={{ color: "white" }} onClick={handleBackClick}>
        <ArrowBackIcon />
      </IconButton>
      <Typography variant="h4" sx={{ mb: 3, color: "#fff" }}>{title}</Typography>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel sx={{ color: "#fff" }}>Filter 1</InputLabel>
            <Select sx={{ color: "#fff", borderColor: "#fff" }} defaultValue="">
              <MenuItem value="">None</MenuItem>
              <MenuItem value="option1">Option 1</MenuItem>
              <MenuItem value="option2">Option 2</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel sx={{ color: "#fff" }}>Filter 2</InputLabel>
            <Select sx={{ color: "#fff", borderColor: "#fff" }} defaultValue="">
              <MenuItem value="">None</MenuItem>
              <MenuItem value="option1">Option 1</MenuItem>
              <MenuItem value="option2">Option 2</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Chart */}
      <Box sx={{ height: "400px", mb: 3 }}>
        {chartType === "Bar" ? (
          <Bar data={chartData} options={chartOptions} />
        ) : (
          <Line data={chartData} options={chartOptions} />
        )}
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ backgroundColor: "#112240" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#fff" }}>Column 1</TableCell>
              <TableCell sx={{ color: "#fff" }}>Column 2</TableCell>
              <TableCell sx={{ color: "#fff" }}>Column 3</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={{ color: "#fff" }}>Data 1</TableCell>
              <TableCell sx={{ color: "#fff" }}>Data 2</TableCell>
              <TableCell sx={{ color: "#fff" }}>Data 3</TableCell>
            </TableRow>
            {/* Add more rows as needed */}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default FullViewChart;
