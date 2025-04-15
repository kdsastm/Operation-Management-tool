import { React, useState } from "react";
import { Box, Grid, Card, IconButton, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TableSortLabel } from "@mui/material";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from "chart.js";
import OpenInFullIcon from "@mui/icons-material/OpenInFull"; // Full view icon
import ChartWithTable from "../components/ChartWithTable";
import { useDemoData } from '@mui/x-data-grid-generator';

// Register Chart.js Components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement);

const cardData = [
  { title: "Total Chargeable Hours", value: "31,958" },
  { title: "Standard Available Hours", value: "46,752" },
  { title: "Telecom Employees", value: "115" },
  { title: "Average of Utilization", value: "63.72%" },
];

const generateChartOptions = (title, horizontal = false) => ({
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: horizontal ? 'y' : 'x', // Set horizontal bar chart for specific cases
  plugins: {
    legend: { display: false },
    title: { display: true, text: title, color: "#fff" },
  },
  scales: {
    x: { grid: { display: false }, ticks: { color: "#fff" } },
    y: { ticks: { color: "#fff" } },
  },
});

const generateChartOptions2 = (title, showLegend = true) => ({
  responsive: true,
  maintainAspectRatio: false, // Ensures the chart uses full available height
  plugins: {
    legend: { display: showLegend },
    title: { display: true, text: title, font: { size: 16 } },
  },
  scales: {
    x: { grid: { display: false } },
    y: {
      beginAtZero: true,
      suggestedMax: 110, // Extends the Y-axis for better visibility
      grid: { color: "rgba(200, 200, 200, 0.2)" },
    },
  },
});

// Revenue Trend (Line Chart)
const revenueTrendsData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Revenue Trend",
      data: [500000, 750000, 600000, 900000, 1100000, 950000],
      borderColor: "#00A6FB",
      backgroundColor: "rgba(0, 166, 251, 0.5)",
      fill: true,
    },
  ],
};

// Partner Wise NFR (Horizontal Bar Chart)
const partnerWiseNFRData = {
  labels: [
    "Sep 2023", "Oct 2023", "Nov 2023", "Dec 2023", "Jan 2024", "Feb 2024", 
    "Mar 2024", "Apr 2024", "May 2024", "Jun 2024", "Jul 2024", "Aug 2024",
    "Sep 2024", "Oct 2024", "Nov 2024", "Dec 2024", "Jan 2025", "Feb 2025", "Mar 2025"
  ],
  datasets: [
    {
      label: "YTD Utilization %",
      data: [72.72, 82.02, 91.06, 84.44, 92.06, 53.47, 66.89, 94.83, 95.03, 92.97, 
             82.59, 71.85, 99.45, 67.88, 50.65, 50.11, 81.29, 55.72, 50.2], // Percentage data
      backgroundColor: "#00509E",
      borderColor: "#00A6FB",
      pointBackgroundColor: "#00A6FB",
      pointBorderColor: "#fff",
      borderWidth: 2,
      fill: true, // Enables area chart effect
      tension: 0.4, // Smoothens the line
    },
  ],
};

// Client Wise NFR (Horizontal Bar Chart)
const clientWiseNFRData = {
  labels: [
    "Sep 2023", "Oct 2023", "Nov 2023", "Dec 2023", "Jan 2024", "Feb 2024",
    "Mar 2024", "Apr 2024", "May 2024", "Jun 2024", "Jul 2024", "Aug 2024",
    "Sep 2024", "Oct 2024", "Nov 2024", "Dec 2024", "Jan 2025", "Feb 2025", "Mar 2025"
  ],
  datasets: [
    {
      label: "MTD Utilization %",
      data: [99.95, 77.22, 83.64, 57.74, 84.84, 51.51, 67.15, 83.8, 84.11, 92.67, 
             53.09, 90.85, 53.09, 86.19, 45.16, 94.48, 69.61, 97.01, 85.61],
      backgroundColor: "rgba(0, 166, 251, 0.5)", // Increased opacity for better fill effect
      borderColor: "#00A6FB",
      pointBackgroundColor: "#00A6FB",
      pointBorderColor: "#fff",
      borderWidth: 2,
      fill: true, // Enables area chart effect
      tension: 0.4, // Smoothens the line
    },
  ],
};

// Project Wise Utilization (Vertical Bar Chart)
const projectWiseUtilizationData = {
  labels: [
    "Employee 1", "Employee 2", "Employee 3", "Employee 4", "Employee 5", 
    "Employee 6", "Employee 7", "Employee 8", "Employee 9", "Employee 10",
    "Employee 11", "Employee 12", "Employee 13", "Employee 14", "Employee 15",
    "Employee 16", "Employee 17", "Employee 18", "Employee 19", "Employee 20",
    "Employee 21", "Employee 22", "Employee 23", "Employee 24", "Employee 25",
    "Employee 26", "Employee 27", "Employee 28", "Employee 29", "Employee 30",
    "Employee 31", "Employee 32", "Employee 33", "Employee 34", "Employee 35",
    "Employee 36", "Employee 37", "Employee 38", "Employee 39", "Employee 40",
    "Employee 41", "Employee 42", "Employee 43", "Employee 44", "Employee 45",
    "Employee 46", "Employee 47", "Employee 48", "Employee 49", "Employee 50",
    "Employee 51", "Employee 52", "Employee 53", "Employee 54", "Employee 55",
    "Employee 56", "Employee 57", "Employee 58", "Employee 59", "Employee 60",
    "Employee 61", "Employee 62", "Employee 63", "Employee 64", "Employee 65",
    "Employee 66", "Employee 67", "Employee 68", "Employee 69", "Employee 70",
    "Employee 71", "Employee 72", "Employee 73", "Employee 74", "Employee 75",
    "Employee 76", "Employee 77", "Employee 78", "Employee 79", "Employee 80",
    "Employee 81", "Employee 82", "Employee 83", "Employee 84", "Employee 85",
    "Employee 86", "Employee 87", "Employee 88", "Employee 89", "Employee 90",
    "Employee 91", "Employee 92", "Employee 93", "Employee 94", "Employee 95",
    "Employee 96", "Employee 97", "Employee 98", "Employee 99", "Employee 100",
    "Employee 101", "Employee 102", "Employee 103", "Employee 104", "Employee 105",
    "Employee 106", "Employee 107", "Employee 108", "Employee 109", "Employee 110",
    "Employee 111", "Employee 112", "Employee 113", "Employee 114", "Employee 115"
  ],
  datasets: [{
    label: "Utilization %",
    data: [
      0.48, 42.59, 64.35, 98.31, 94.18, 37.19, 81.58, 12.96, 25.94, 71.20,
      95.40, 62.98, 38.01, 40.06, 9.61, 79.72, 96.27, 53.95, 1.40, 22.31,
      8.05, 41.37, 64.18, 80.15, 17.64, 34.79, 78.31, 30.10, 98.26, 4.44,
      26.19, 8.34, 90.90, 33.05, 29.15, 45.24, 43.15, 32.72, 40.87, 87.52,
      15.60, 44.60, 75.16, 18.29, 25.61, 71.25, 44.46, 61.36, 21.55, 10.48,
      87.80, 71.16, 44.36, 7.70, 65.02, 7.60, 65.40, 43.48, 37.57, 11.32,
      18.61, 46.05, 75.43, 98.99, 13.80, 83.11, 3.89, 7.19, 70.76, 82.53,
      2.01, 84.25, 34.95, 20.68, 43.29, 11.31, 0.74, 76.49, 77.81, 44.66,
      72.78, 98.19, 15.61, 44.95, 62.46, 82.85, 89.31, 57.98, 82.52, 75.69,
      8.14, 90.92, 49.60, 15.48, 15.45, 29.70, 93.43, 77.73, 21.51, 49.63,
      65.13, 93.70, 8.75, 13.60, 16.78, 41.24, 82.69, 76.92, 3.22, 11.46,
      46.07, 74.22, 18.17, 50.07, 15.10
    ],
    backgroundColor: "#00A6FB"
  }]
};

const generateEmployees = () => {
  const designations = ["Consultant", "Senior Consultant", "Manager", "Senior Manager", "Director"];
  return Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `Employee ${i + 1}`,
    designation: designations[i % designations.length],
    utilization: Math.floor(Math.random() * 40) + 60, // Between 60-100%
    chargeable: Math.floor(Math.random() * 200) + 100, // Between 100-300 hours
    ncHours: Math.floor(Math.random() * 20), // 0-20 hours
    bdHours: Math.floor(Math.random() * 20), // 0-20 hours
    leaveHours: Math.floor(Math.random() * 10), // 0-10 hours
  }));
};

const generateEmployees1 = () => {
  const designations = ["Consultant", "Senior Consultant", "Manager", "Senior Manager", "Director"];
  return Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `Employee ${i + 1}`,
    designation: designations[i % designations.length],
    utilization: Math.floor(Math.random() * 40), // Between 0-40%
  }));
};

const employees = generateEmployees();
const employees1 = generateEmployees1();

const columns = [
  { id: "name", label: "Employee Name" },
  { id: "designation", label: "Designation" },
  { id: "utilization", label: "Utilization (%)", numeric: true },
  { id: "chargeable", label: "Chargeable Hours", numeric: true },
  { id: "ncHours", label: "NC Hours", numeric: true },
  { id: "bdHours", label: "BD Hours", numeric: true },
  { id: "leaveHours", label: "Leave Hours", numeric: true },
];

const columns2 = [
  { id: "name", label: "Employee Name" },
  { id: "designation", label: "Designation" },
  { id: "utilization", label: "Utilization (%)", numeric: true },
];

const Utilization = () => {
  const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "utilization", direction: "desc" });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [fullViewChart, setFullViewChart] = useState(null);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFullViewClick = (chartData, chartOptions, chartType, title) => {
    setFullViewChart({ chartData, chartOptions, chartType, title });
  };

  const filteredData = employees
    .filter((emp) => emp.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

  const filteredData1 = employees1
    .filter((emp) => emp.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <Box sx={{ backgroundColor: "#0A192F", color: "white", minHeight: "100vh", mt: 9, width: "100%" }}>
      {/* Cards Section */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {cardData.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                background: "linear-gradient(135deg, #002F6C 30%, #00509E 100%)",
                color: "#fff",
                borderRadius: "12px",
                p: 2,
                display: "flex",
                alignItems: "center",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Adds depth
                minHeight: "80px",
              }}
            >
              {/* Text Content */}
              <CardContent sx={{ textAlign: "left", p: 0 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", opacity: 0.9 }}>
                  {card.title}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {fullViewChart ? (
        <ChartWithTable
          chartData={fullViewChart.chartData}
          chartOptions={fullViewChart.chartOptions}
          chartType={fullViewChart.chartType}
          title={fullViewChart.title}
          tableData={filteredData}
          tableColumns={columns}
        />
      ) : (
        <Grid container spacing={3} sx={{ mt: 5 }}>
          {/* First Row: Client Wise, Revenue Trend, Partner Wise */}
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: "#112240", borderRadius: "12px", p: 2, position: "relative" }}>
              <IconButton
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  color: "white",
                }}
                onClick={() => handleFullViewClick(clientWiseNFRData, generateChartOptions2("", true), "line", "MTD Utilization %")}
              >
                <OpenInFullIcon />
              </IconButton>
              <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>MTD Utilization %</Typography>
              <div style={{ height: "300px", width: "100%" }}>
                <Line data={clientWiseNFRData} options={generateChartOptions2("", true)} />
              </div>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: "#112240", borderRadius: "12px", p: 2, position: "relative" }}>
              <IconButton
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  color: "white",
                }}
                onClick={() => handleFullViewClick(filteredData1, columns2, "table", "Utilization below 40%")}
              >
                <OpenInFullIcon />
              </IconButton>
              <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>Utilization below 40%</Typography>
              <Box sx={{ height: "300px" }}>
                <Box sx={{ borderRadius: 2 }}>
                  <Paper sx={{ backgroundColor: "#112240", color: "white", borderRadius: "12px", overflow: "hidden" }}>
                    <TableContainer sx={{
                      maxHeight: 230, // Fixed height for vertical scrolling
                      overflowY: "auto",
                      scrollbarWidth: "none", // For Firefox
                      "&::-webkit-scrollbar": { display: "none" }, // For Chrome, Safari
                    }}>
                      <Table>
                        <TableHead sx={{ backgroundColor: "#00509E" }}>
                          <TableRow>
                            {columns2.map((column) => (
                              <TableCell key={column.id} sx={{ color: "white", fontWeight: "bold" }}>
                                <TableSortLabel
                                  active={sortConfig.key === column.id}
                                  direction={sortConfig.key === column.id ? sortConfig.direction : "asc"}
                                  onClick={() => handleSort(column.id)}
                                  sx={{ color: "white" }}
                                >
                                  {column.label}
                                </TableSortLabel>
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredData1.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                            <TableRow key={row.id} sx={{ "&:nth-of-type(even)": { backgroundColor: "#0A192F" } }}>
                              {columns2.map((column) => (
                                <TableCell key={column.id} sx={{ color: "white" }}>
                                  {row[column.id]}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <TablePagination
                      rowsPerPageOptions={[10, 25, 50]}
                      component="div"
                      count={filteredData1.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      sx={{ color: "white" }}
                    />
                  </Paper>
                </Box>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: "#112240", borderRadius: "12px", p: 2, position: "relative" }}>
              <IconButton
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  color: "white",
                }}
                onClick={() => handleFullViewClick(partnerWiseNFRData, generateChartOptions2("", true), "line", "YTD Utilization %")}
              >
                <OpenInFullIcon />
              </IconButton>
              <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>YTD Utilization %</Typography>
              <Box sx={{ height: "300px" }}>
                <div style={{ height: "300px", width: "100%" }}>
                  <Line data={partnerWiseNFRData} options={generateChartOptions2("", true)} />
                </div>
              </Box>
            </Card>
          </Grid>

          {/* Second Row: Project Wise, Country Wise */}
          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: "#112240", borderRadius: "12px", p: 2, position: "relative" }}>
              <IconButton
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  color: "white",
                }}
                onClick={() => handleFullViewClick(projectWiseUtilizationData, generateChartOptions(""), "bar", "Average of Utilization by Employee")}
              >
                <OpenInFullIcon />
              </IconButton>
              <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>Average of Utilization by Employee</Typography>
              <Box sx={{ width: "100%", overflowX: "auto", whiteSpace: "nowrap", "&::-webkit-scrollbar": { display: "none" } }}>
                <Box sx={{ width: `${115 * 20}px`, height: "500px" }}> {/* Adjust width dynamically */}
                  <Bar data={projectWiseUtilizationData} options={generateChartOptions("")} />
                </Box>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: "#112240", borderRadius: "12px", p: 2, position: "relative" }}>
              <IconButton
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  color: "white",
                }}
                onClick={() => handleFullViewClick(filteredData, columns, "table", "Detailed Employeewise Hours")}
              >
                <OpenInFullIcon />
              </IconButton>
              <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>Detailed Employeewise Hours</Typography>
              <Box sx={{ height: "500px" }}>
                {/* <Bar data={countryWiseNFRData} options={generateChartOptions("Country Wise NFR")} /> */}
                <Box sx={{ p: 2, borderRadius: 2 }}>
                  <Paper sx={{ backgroundColor: "#112240", color: "white", borderRadius: "12px", overflow: "hidden" }}>
                    <TableContainer sx={{
                      maxHeight: 430, // Fixed height for vertical scrolling
                      overflowY: "auto",
                      scrollbarWidth: "none", // For Firefox
                      "&::-webkit-scrollbar": { display: "none" }, // For Chrome, Safari
                    }}>
                      <Table>
                        <TableHead sx={{ backgroundColor: "#00509E" }}>
                          <TableRow>
                            {columns.map((column) => (
                              <TableCell key={column.id} sx={{ color: "white", fontWeight: "bold" }}>
                                <TableSortLabel
                                  active={sortConfig.key === column.id}
                                  direction={sortConfig.key === column.id ? sortConfig.direction : "asc"}
                                  onClick={() => handleSort(column.id)}
                                  sx={{ color: "white" }}
                                >
                                  {column.label}
                                </TableSortLabel>
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                            <TableRow key={row.id} sx={{ "&:nth-of-type(even)": { backgroundColor: "#0A192F" } }}>
                              {columns.map((column) => (
                                <TableCell key={column.id} sx={{ color: "white" }}>
                                  {row[column.id]}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <TablePagination
                      rowsPerPageOptions={[10, 25, 50]}
                      component="div"
                      count={filteredData.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      sx={{ color: "white" }}
                    />
                  </Paper>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Table Section */}


      {/* Footer */}
      <Box sx={{ mt: 5, textAlign: "center", color: "#888" }}>
        <Typography variant="body2">© 2025 Revenue Analytics. All rights reserved.</Typography>
      </Box>
    </Box>
  );
};

export default Utilization;
