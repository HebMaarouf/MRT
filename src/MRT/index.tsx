import { MaterialReactTable } from "material-react-table";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Paper, Container, Box } from "@mui/material";

// Sample Data
const data = [
  { id: 1, firstName: "John", lastName: "Doe", age: 30 },
  { id: 2, firstName: "Jane", lastName: "Smith", age: 25 },
  { id: 3, firstName: "Alice", lastName: "Johnson", age: 28 },
];

// Table Columns
const columns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "firstName", header: "First Name" },
  { accessorKey: "lastName", header: "Last Name" },
  { accessorKey: "age", header: "Age" },
];

// Custom MUI Theme
const theme = createTheme({
  palette: {
    mode: "light", // Change to 'dark' for dark mode
    primary: {
      main: "#4A90E2",
    },
    secondary: {
      main: "#E91E63",
    },
  },
});

const StyledMRT = () => {
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Box
          sx={{
            backdropFilter: "blur(10px)",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            padding: "24px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <Paper
            elevation={5}
            sx={{
              overflow: "hidden",
              borderRadius: "16px",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
            }}
          >
            <MaterialReactTable
              columns={columns}
              data={data}
              enableSorting
              enableColumnFilters
              enablePagination
              muiTableHeadCellProps={{
                sx: {
                  backgroundColor: "#4A90E2",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "16px",
                },
              }}
              muiTableBodyRowProps={{
                sx: {
                  "&:hover": {
                    backgroundColor: "rgba(74, 144, 226, 0.1)",
                    transform: "scale(1.01)",
                    transition: "all 0.2s ease-in-out",
                  },
                },
              }}
              muiTableProps={{
                sx: {
                  borderRadius: "16px",
                  width: "100%", // Make sure table fills the container
                  tableLayout: "fixed", // Avoid issues with overflowing columns
                  "& .MuiTableCell-root": {
                    padding: "12px",
                  },
                  "& .MuiTableRow-root:nth-of-type(odd)": {
                    backgroundColor: "rgba(74, 144, 226, 0.05)",
                  },
                  "& .MuiTableBody-root": {
                    maxHeight: "400px", // Set a max-height for scrollable body
                    overflowY: "auto",  // Enable vertical scroll
                    overflowX: "auto",  // Enable horizontal scroll when necessary
                    "&::-webkit-scrollbar": {
                      width: "8px", // Set the width of the scrollbar
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "#4A90E2", // Scrollbar thumb color
                      borderRadius: "10px", // Rounded thumb
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: "#f0f0f0", // Scrollbar track color
                      borderRadius: "10px", // Rounded track
                    },
                  },
                },
              }}
            />
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default StyledMRT;
