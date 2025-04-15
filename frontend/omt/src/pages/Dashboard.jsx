import React, { useState } from "react";
import {
  Container, Grid, Button, Typography, Card, CardContent, AppBar, Toolbar, IconButton, InputBase, Drawer, List, ListItem, ListItemText, Box, Tooltip, Paper, Collapse
} from "@mui/material";
import {
  Menu as MenuIcon, AccountCircle, Search as SearchIcon, Dashboard as DashboardIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon,
  MonetizationOn as RevenueIcon, BarChart as UtilizationIcon, Map as PlottingIcon, Work as WIPIcon, AccountBalance as DebtorsIcon, TrendingUp as ProjectionsIcon, Home as HomeIcon, ExpandLess, ExpandMore, ExitToApp as LogoutIcon
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import KPMGLogo from "./kpmg.png";
import RevenueDash from "./RevenueDash";
import UtilizationDash from "./Utilization";
import PlottingDash from "./Plotting";

const StyledContainer = styled(Box)({
  backgroundColor: "#0D1B2A",
  color: "#E0E1DD",
  minHeight: "100vh",
  display: "flex",
});

const Sidebar = styled(Drawer)(({ theme, open }) => ({
  width: open ? 240 : 60,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: open ? 240 : 60,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    backgroundColor: "#1B263B",
    color: "#E0E1DD",
  },
}));

const Content = styled(Box)(({ open }) => ({
  flexGrow: 1,
  marginTop:20,
  marginLeft: open ? 40 : 40,
  transition: "margin 0.3s ease-in-out",
  display: "flex",
  flexDirection: "column",
  width: `calc(100% - ${open ? 240 : 60}px)`,
}));

const GridCategoryBox = styled(Box)({
  padding: "20px",
  borderRadius: "12px",
  backgroundColor: "#e0e0e0",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  width: "100%",
  maxWidth: "800px",
});

// Define Dashboard Components for Each Category
const UtilizationDashboard = () => <Typography variant="h5">Utilization Dashboard Content</Typography>;
const PlottingDashboard = () => <Typography variant="h5">Plotting Dashboard Content</Typography>;
const WIPDashboard = () => <Typography variant="h5">WIP Dashboard Content</Typography>;
const DebtorsDashboard = () => <Typography variant="h5">Debtors Dashboard Content</Typography>;
const ProjectionsDashboard = () => <Typography variant="h5">Projections Dashboard Content</Typography>;

const categories = [
  { name: "Revenue", icon: <RevenueIcon fontSize="large" />, subcategories: ["Dashboard", "Expenses", "Profit"], description: "Track financials" },
  { name: "Utilization", icon: <UtilizationIcon fontSize="large" />, subcategories: ["Dashboard", "Assets", "Efficiency"], description: "Monitor resource and asset efficiency." },
  { name: "Plotting", icon: <PlottingIcon fontSize="large" />, subcategories: ["Dashboard", "Planning", "Implementation"], description: "Strategic planning and mapping" },
  { name: "WIP", icon: <WIPIcon fontSize="large" />, subcategories: [], description: "Manage WIP efficiently." },
  { name: "Debtors", icon: <DebtorsIcon fontSize="large" />, subcategories: ["Outstanding", "Paid", "Due Dates"], description: "Keep track of outstanding payments." },
  { name: "Projections", icon: <ProjectionsIcon fontSize="large" />, subcategories: ["Market Trends", "Future Goals", "Risk Analysis"], description: "Manage future trends and goals." },
];

const HomePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});

  const handleExpandClick = (categoryName) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logout clicked");
  };

  const dashboardComponents = {
    Revenue: <RevenueDash />,
    Utilization: <UtilizationDash />,
    Plotting: <PlottingDash />,
    WIP: <WIPDashboard />,
    Debtors: <DebtorsDashboard />,
    Projections: <ProjectionsDashboard />,
  };

  return (
    <StyledContainer>
      <Sidebar variant="permanent" open={sidebarOpen}>
        <Box sx={{ display: "flex", justifyContent: "center", p: 0 }}>
          <img src={KPMGLogo} alt="KPMG Logo" style={{ width: sidebarOpen ? "100px" : "50px" }} />
        </Box>
        <List sx={{ flexGrow: 1 }}>
          <Tooltip title="Home" placement="right">
            <ListItem button onClick={() => setSelectedCategory(null)} sx={{ color: "white" }}>
              <Box mr={1}><HomeIcon fontSize="large" /></Box>
              {sidebarOpen && <ListItemText primary="Home" />}
            </ListItem>
          </Tooltip>
          {categories.map((category, index) => (
            <React.Fragment key={index}>
              <Tooltip title={`View ${category.name}`} placement="right">
                <ListItem button onClick={() => handleExpandClick(category.name)}>
                  <Box mr={1}>{category.icon}</Box>
                  <ListItemText primary={category.name} />
                  {category.subcategories.length > 0 && (expandedCategories[category.name] ? <ExpandLess /> : <ExpandMore />)}
                </ListItem>
              </Tooltip>
              <Collapse in={expandedCategories[category.name]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {category.subcategories.map((sub, subIndex) => (
                    <ListItem button key={subIndex} sx={{ pl: 4 }} 
                    onClick={() => {
                      if (sub === "Dashboard") {
                        setSelectedCategory(category); // Navigate to the dashboard route
                      } 
                    }}>
                      <ListItemText primary={sub} />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          ))}
        </List>
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1, mt: "auto" }}>
          {sidebarOpen && (
            <ListItem button onClick={handleLogout} sx={{ color: "white" }}>
              <Box mr={1}><LogoutIcon fontSize="large" /></Box>
              <ListItemText primary="Logout" />
            </ListItem>
          )}
          <IconButton onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? (
              <ChevronLeftIcon sx={{ color: "white", fontSize: 32 }} />
            ) : (
              <ChevronRightIcon sx={{ color: "white", fontSize: 32 }} />
            )}
          </IconButton>
        </Box>
      </Sidebar>

      <Content open={sidebarOpen}>
        <AppBar position="static" sx={{ backgroundColor: "#1B263B" }}>
          <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ color: "white", fontWeight: "bold" }}>
  {selectedCategory?.name ? `Home / ${selectedCategory.name} Dashboard` : "Home"}
</Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <InputBase placeholder="Search..." sx={{ width: "150px", color: 'white', backgroundColor: '#415A77', padding: '5px 10px', borderRadius: 1 }} />
              <IconButton color="inherit"><SearchIcon /></IconButton>
              <IconButton color="inherit"><AccountCircle /></IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            mt: -10,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            textAlign: "center",
            width:"90%",
            px: 2, // Added padding for better spacing on smaller screens
          }}
        >
          {selectedCategory ? (
            <>
              <Typography variant="h4" gutterBottom>
                
              </Typography>
              {dashboardComponents[selectedCategory.name]}
            </>
          ) : (
            <>
              {/* <Box sx={{ textAlign: "center", maxWidth: 800, mx: "auto", py: 3, }}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: "600", color: "primary.main" }}
                >
                  Operations Management Tool
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    maxWidth: 750,
                    mx: "auto",
                    lineHeight: 1.5,
                  }}
                >
                  An all-in-one platform for seamless revenue management, resource utilization,
                  Resource planning, WIP tracking, Debtors management, and accurate
                  financial projections.
                </Typography>
              </Box> */}

              <Box sx={{ width: "100%", maxWidth: 900 }}>
                <Grid container spacing={3} justifyContent="center">
                  {categories.map((category, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Paper
                        elevation={3}
                        sx={{
                          p: 3,
                          textAlign: "center",
                          borderRadius: 2,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          minHeight: "140px",
                          cursor: "pointer",
                          transition: "0.3s",
                          "&:hover": {
                            transform: "scale(1.05)",
                            boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                          },
                        }}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category.icon}
                        <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: "bold" }}>
                          {category.name}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
                          {category.description}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </>
          )}
        </Box>
      </Content>
    </StyledContainer>
  );
};

export default HomePage;
