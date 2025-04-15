import React, { useState, useMemo } from "react";
import {
  Box,
  Card,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  TableSortLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { Bar, Line } from "react-chartjs-2";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import { useNavigate } from "react-router-dom";
import FilterListIcon from "@mui/icons-material/FilterList";

const ChartWithTable = ({ chartData, chartOptions, chartType, title, tableData, tableColumns,heightofchart }) => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState([]); // Array of filters
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState({ field: "", type: "equals", value: "" });
  const [filterCombination, setFilterCombination] = useState("AND"); // "AND" or "OR"
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const handleFullViewClick = () => {
    navigate("/full-view-chart", { state: { chartData, chartOptions, chartType, title} });
  };

  const handleSort = (columnId) => {
    setSortConfig((prevSortConfig) => ({
      key: columnId,
      direction: prevSortConfig.key === columnId && prevSortConfig.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleFilterDialogOpen = () => {
    setIsFilterDialogOpen(true);
  };

  const handleFilterDialogClose = () => {
    setIsFilterDialogOpen(false);
    setCurrentFilter({ field: "", type: "equals", value: "" }); // Reset current filter
    setFilterCombination("AND"); // Reset combination to default
  };

  const handleAddFilter = () => {
    if (currentFilter.field && currentFilter.value) {
      const newFilter = { ...currentFilter, combination: filterCombination };
      setFilters((prevFilters) => [...prevFilters, newFilter]);
      setCurrentFilter({ field: "", type: "equals", value: "" }); // Reset current filter
      setFilterCombination("AND"); // Reset combination to default
    }
  };

  const handleRemoveFilter = (index) => {
    setFilters((prevFilters) => prevFilters.filter((_, i) => i !== index));
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleApplyFilters = () => {
    setIsFilterDialogOpen(false);
  };

  const handleClearFilters = () => {
    setFilters([]);
  };

  const filteredData = useMemo(() => {
    return tableData.filter((row) => {
      if (filters.length === 0) return true;

      let result = filters[0].combination === "OR" ? false : true;

      filters.forEach((filter, index) => {
        const cellValue = row[filter.field];
        const filterValue = filter.value;

        let conditionResult;
        switch (filter.type) {
          case "contains":
            conditionResult = cellValue.toString().toLowerCase().includes(filterValue.toString().toLowerCase());
            break;
          case "lessThan":
            conditionResult = cellValue < filterValue;
            break;
          case "greaterThan":
            conditionResult = cellValue > filterValue;
            break;
          case "equals":
          default:
            conditionResult = cellValue === filterValue;
            break;
        }

        if (filter.combination === "OR") {
          result = result || conditionResult;
        } else {
          result = result && conditionResult;
        }
      });

      return result;
    });
  }, [tableData, filters]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  return (
    <Box sx={{ backgroundColor: "#0A192F", color: "white", minHeight: "100vh", mt: 9, width: "100%" }}>
      <Card sx={{ backgroundColor: "#112240", borderRadius: "12px", p: 2, position: "relative", mb: 5 }}>
        <IconButton
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "white",
          }}
          onClick={handleFullViewClick}
        >
          <OpenInFullIcon />
        </IconButton>
        <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>{title}</Typography>
        <Box
  sx={{
    height: "700px",
    overflowY: "auto", // Enable vertical scroll
    overflowX: "auto",
    paddingRight: "10px",
  }}
>
  <Box sx={{ height: `${chartData.labels.length * 60}px`, minHeight: "700px" }}>
    {chartType === "Bar" ? (
      <Bar data={chartData} options={{ ...chartOptions, maintainAspectRatio: false }} />
    ) : (
      <Line data={chartData} options={{ ...chartOptions, maintainAspectRatio: false }} />
    )}
  </Box>
</Box>
      </Card>

      <Box sx={{ mt: 5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Button variant="contained" startIcon={<FilterListIcon />} onClick={handleFilterDialogOpen}>
          Filter
        </Button>
        {filters.length > 0 && (
          <Button variant="outlined" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        )}
      </Box>

      {filters.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" sx={{ color: "#fff",textAlign: "left" }}>Applied Filters:</Typography>
          {filters.map((filter, index) => (
            <Box key={index} sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <Typography variant="body2" sx={{ color: "#fff", mr: 1 }}>
                {`${filter.field} ${filter.type} ${filter.value}`}
              </Typography>
              <Button size="small" onClick={() => handleRemoveFilter(index)}>Remove</Button>
            </Box>
          ))}
        </Box>
      )}

      <Dialog open={isFilterDialogOpen} onClose={handleFilterDialogClose}>
        <DialogTitle>Add Filter</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <Select
              value={currentFilter.field}
              onChange={(e) => setCurrentFilter({ ...currentFilter, field: e.target.value })}
              displayEmpty
              sx={{ mb: 2 }}
            >
              <MenuItem value="" disabled>
                Select Field
              </MenuItem>
              {tableColumns.map((column) => (
                <MenuItem key={column.id} value={column.id}>
                  {column.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Select
              value={currentFilter.type}
              onChange={(e) => setCurrentFilter({ ...currentFilter, type: e.target.value })}
              displayEmpty
            >
              <MenuItem value="equals">Equals</MenuItem>
              <MenuItem value="contains">Contains</MenuItem>
              <MenuItem value="lessThan">Less Than</MenuItem>
              <MenuItem value="greaterThan">Greater Than</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            value={currentFilter.value}
            onChange={(e) => setCurrentFilter({ ...currentFilter, value: e.target.value })}
            placeholder="Enter value"
          />
          {filters.length > 0 && (
  <FormControl fullWidth sx={{ mt: 2 }}>
    <Select
      value={filterCombination}
      onChange={(e) => setFilterCombination(e.target.value)}
      displayEmpty
    >
      <MenuItem value="AND">AND</MenuItem>
      <MenuItem value="OR">OR</MenuItem>
    </Select>
  </FormControl>
)}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFilterDialogClose}>Cancel</Button>
          <Button onClick={handleAddFilter}>Add Filter</Button>
          <Button onClick={handleApplyFilters} variant="contained">
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ mt: 3 }}>
      <TableContainer component={Paper} sx={{ backgroundColor: "#112240" }}>
        <Table>
          <TableHead>
            <TableRow>
              {tableColumns.map((column) => (
                <TableCell key={column.id} sx={{ color: "#fff" }}>
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
            {sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
              <TableRow key={index}>
                {tableColumns.map((column) => (
                  <TableCell key={column.id} sx={{ color: "#fff" }}>
                    {row[column.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={tableData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ color: "white" }}
      />
      </Box>
    </Box>
  );
};

export default ChartWithTable;