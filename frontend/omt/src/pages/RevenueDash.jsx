import React, { useState, useEffect } from "react";
import { Box, Grid, Card, IconButton, CardContent, Typography } from "@mui/material";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from "chart.js";
import OpenInFullIcon from "@mui/icons-material/OpenInFull"; // Full view icon
import ChartWithTable from "../components/ChartWithTable";
import axios from 'axios';

// Register Chart.js Components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement);



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

// Revenue Trend (Line Chart)
// const revenueTrendsData = {
//   labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
//   datasets: [
//     {
//       label: "Revenue Trend",
//       data: [500000, 750000, 600000, 900000, 1100000, 950000],
//       borderColor: "#00A6FB",
//       backgroundColor: "rgba(0, 166, 251, 0.5)",
//       fill: true,
//     },
//   ],
// };

// Partner Wise NFR (Horizontal Bar Chart)
const partnerWiseNFRData = {
  labels: ["Partner A", "Partner B", "Partner C", "Partner D", "Partner E"],
  datasets: [
    { label: "Partner Wise NFR", data: [300000, 500000, 200000, 400000, 250000], backgroundColor: "#00509E" },
  ],
};

// Client Wise NFR (Horizontal Bar Chart)


// Project Wise NFR (Vertical Bar Chart)
const projectWiseNFRData = {
  labels: ["Project A", "Project B", "Project C"],
  datasets: [{ label: "NFR", data: [200000, 300000, 400000], backgroundColor: "#00A6FB" }],
};

// Country Wise NFR (Vertical Bar Chart)
const countryWiseNFRData = {
  labels: ["Country A", "Country B", "Country C"],
  datasets: [{ label: "NFR", data: [150000, 250000, 350000], backgroundColor: "#00509E" }],
};

// const tableData = [
//   { column1: "Data 1", column2: "Data 2", column3: "Data 3" },
//   { column1: "Data 4", column2: "Data 5", column3: "Data 6" },
//   // Add more rows as needed
// ];

const tableColumns = [
  { id: "column1", label: "Client" },
  { id: "column2", label: "NFR" }
];
const tableColumns1 = [
  { id: "column1", label: "Month" },
  { id: "column2", label: "NFR" }
];


const RevenueDash = () => {
  const [fullViewChart, setFullViewChart] = useState(null);
  const [stats, setStats] = useState({
    totalPartners: 0,
    totalProjects: 0,
    totalNFR: 0,
    totalCountry: 0,
    totalClient: 0,
  }); // Initialize with default values to avoid null errors
  const [clientwisenfr, setClientwisenfr]  =useState({
    labels: [],
    datasets: [ { label: "NFR", data: [], backgroundColor: "#00A6FB" }],
  });
  const [revenueTrendsData,setRevenuetrendsdata] = useState({
    labels: [],
    datasets: [
      {
        label: "Revenue Trend",
        data: [],
        borderColor: "#00A6FB",
        backgroundColor: "rgba(0, 166, 251, 0.5)",
        fill: true,
      },
    ],
  });




  const [tableData, setTableData] = useState([]); // Correctly initialize tableData as an empty array
  const [tableData1, setTableData1] = useState([]); 
  // const clientWiseNFRData = {
  //   labels: ["Client A", "Client B", "Client C", "Client D", "Client E"],
  //   datasets: [
  //     { label: "Client Wise NFR", data: [400000, 600000, 300000, 500000, 350000], backgroundColor: "#00A6FB" },
  //   ],
  // };
  const handleFullViewClick = (chartData, chartOptions, chartType, title,tableData,Columns) => {
    setFullViewChart({ chartData, chartOptions, chartType, title,tableData,Columns });
  };

  // useEffect(() => {
  //   const fetchStats = async () => {
  //     try {
  //       const response = await axios.get('http://localhost:5000/api/auth/stats');
  //       console.log("Fetched from backend:", response.data);
  //       setStats(response.data);
        
  //     } catch (error) {
  //       console.error('Error fetching stats:', error);
  //     }
  //   };
  
  //   fetchStats();
  // }, []);
  
  // // Watch for updates to stats
  // useEffect(() => {
  //   if (stats !== null) {
  //     console.log("✅ Stats state updated:", stats);
  //   }
  // }, [stats]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/stats');
        const response1 = await axios.get('http://localhost:5000/api/auth/clientnfr');
        const response2 = await axios.get('http://localhost:5000/api/auth/revenuetrend');
        console.log("Fetched from backend:", response.data);
        console.log("Fetched from backend:", response1.data);
        console.log("Fetched from backend:", response2.data);
        setStats({
          totalPartners: response.data.totalPartners || 0,
          totalProjects: response.data.totalProjects || 0,
          totalNFR: response.data.totalNFR || 0,
          totalCountry: response.data.totalCountry || 0,
          totalClient: response.data.totalClient || 0,
        });
        setClientwisenfr({
          labels: response1.data.clientNames || [],
          datasets: [
            {
              label: "NFR",
              data: response1.data.nfrValues||[],
              backgroundColor: "#00A6FB"
            }
          ]
      });
      setRevenuetrendsdata({
          labels: response2.data.labels || [],
          datasets: [
            {
              label: "Revenue Trend",
              data: response2.data.nfrValues||[],
              backgroundColor: "#00A6FB"
            }
          ]
      });

      const updatedTableData = response1.data.clientNames.map((label, index) => ({
        column1: label,
        column2: response1.data.nfrValues[index],
      }));
      const updatedTableData1 = response2.data.labels.map((label, index) => ({
        column1: label,
        column2: response2.data.nfrValues[index],
      }));
      console.log("tabledata",updatedTableData);
      setTableData(updatedTableData);
      setTableData1(updatedTableData1);

      
      console.log("clientwisenfr", clientwisenfr);
        
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);
  
  const cardData = [
    { title: "Partners", value: stats.totalPartners ?? 0 },
    { title: "Projects", value: stats.totalProjects ?? 0 },
    { title: "Total NFR", value: stats.totalNFR ?? 0 },
    { title: "Country", value: stats.totalCountry ?? 0 },
    { title: "Client", value: stats.totalClient ?? 0 },
  ];
  return (
    <Box sx={{ backgroundColor: "#0A192F", color: "white", minHeight: "100vh", mt: 9, width: "100%" }}>
      {/* Cards Section */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {cardData.map((card, index) => (
          <Grid item xs={12} sm={6} md={2.4} key={index}>
            <Card
              sx={{
                background: "linear-gradient(135deg, #002F6C 30%, #00509E 100%)",
                color: "#fff",
                borderRadius: "12px",
                p: 2,
                display: "flex",
                alignItems: "center",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Adds depth
                height: "80px",
              }}
            >
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
          tableData={fullViewChart.tableData}
          tableColumns={fullViewChart.Columns}
          heightofchart={"700px"}
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
                onClick={() => handleFullViewClick(clientwisenfr, generateChartOptions("NFR", true), "Bar", "Client Wise NFR",tableData,tableColumns)}
              >
                <OpenInFullIcon />
              </IconButton>
              <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>Top 5 Client Wise NFR</Typography>
              <Box sx={{ height: "300px", overflowX: "auto", maxWidth: "100%" }}>
              <Box sx={{ minWidth: "500px", height: "250px" }}>
              <Bar
  data={{
    labels: clientwisenfr.labels.slice(0, 5),
    datasets: [
      {
        ...clientwisenfr.datasets[0],
        data: clientwisenfr.datasets[0].data.slice(0, 5),
      },
    ],
  }}
  options={generateChartOptions("NFR", true)}
/>
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
                onClick={() => handleFullViewClick(revenueTrendsData, generateChartOptions("Revenue Trend"), "Line", "Revenue Trend",tableData1,tableColumns1)}
              >
                <OpenInFullIcon />
              </IconButton>
              <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>Last 6 Month Revenue</Typography>
              <Box sx={{ height: "300px" }}>
                <Line data={{
  labels: revenueTrendsData.labels.slice(-6),
  datasets: [
    {
      ...revenueTrendsData.datasets[0],
      data: revenueTrendsData.datasets[0].data.slice(-6),
    },
  ],
}} options={generateChartOptions("Revenue")} />
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
                onClick={() => handleFullViewClick(partnerWiseNFRData, generateChartOptions("Partner Wise NFR", true), "Bar", "Partner Wise NFR")}
              >
                <OpenInFullIcon />
              </IconButton>
              <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>Partner Wise NFR</Typography>
              <Box sx={{ height: "300px" }}>
                <Bar data={partnerWiseNFRData} options={generateChartOptions("Partner Wise NFR", true)} />
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
                onClick={() => handleFullViewClick(projectWiseNFRData, generateChartOptions("Project Wise NFR"), "Bar", "Project Wise NFR")}
              >
                <OpenInFullIcon />
              </IconButton>
              <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>Project Wise NFR</Typography>
              <Box sx={{ height: "300px" }}>
                <Bar data={projectWiseNFRData} options={generateChartOptions("Project Wise NFR")} />
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
                onClick={() => handleFullViewClick(countryWiseNFRData, generateChartOptions("Country Wise NFR"), "Bar", "Country Wise NFR")}
              >
                <OpenInFullIcon />
              </IconButton>
              <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>Country Wise NFR</Typography>
              <Box sx={{ height: "300px" }}>
                <Bar data={countryWiseNFRData} options={generateChartOptions("Country Wise NFR")} />
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Footer */}
      <Box sx={{ mt: 5, textAlign: "center", color: "#888" }}>
        <Typography variant="body2">© 2025 Revenue Analytics. All rights reserved.</Typography>
      </Box>
    </Box>
  );
};

export default RevenueDash;