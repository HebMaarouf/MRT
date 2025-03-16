import {  useState } from "react";
import { Paper, Container, Box } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { ThemeProvider, createTheme } from "@mui/material/styles";


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

  const [tableData, setTableData] = useState([
    { id: 1, firstName: "John", lastName: "Doe", age: 30 },
    { id: 2, firstName: "Jane", lastName: "Smith", age: 25 },
    { id: 3, firstName: "Alice", lastName: "Johnson", age: 28 },
    { id: 4, firstName: "John", lastName: "Doe", age: 30 },
    { id: 5, firstName: "Jane", lastName: "Smith", age: 25 },
    { id: 6, firstName: "Alice", lastName: "Johnson", age: 28 },
    { id: 7, firstName: "John", lastName: "Doe", age: 30 },
    { id: 8, firstName: "Jane", lastName: "Smith", age: 25 },
    { id: 9, firstName: "Alice", lastName: "Johnson", age: 28 },
    { id: 10, firstName: "John", lastName: "Doe", age: 30 },
    { id: 11, firstName: "Jane", lastName: "Smith", age: 25 },
    { id: 12, firstName: "Alice", lastName: "Johnson", age: 28 },
    { id: 13, firstName: "John", lastName: "Doe", age: 30 },
    { id: 14, firstName: "Jane", lastName: "Smith", age: 25 },
    { id: 15, firstName: "Alice", lastName: "Johnson", age: 28 },
    { id: 16, firstName: "John", lastName: "Doe", age: 30 },
    { id: 17, firstName: "Jane", lastName: "Smith", age: 25 },
    { id: 18, firstName: "Alice", lastName: "Johnson", age: 28 },
  ]);


  // Table Columns
  const columns = [
    { accessorKey: 'id', header: 'ID', enableSorting: true },
    { accessorKey: 'firstName', header: 'First Name', enableSorting: true },
    { accessorKey: 'lastName', header: 'Last Name', enableSorting: true },
    { accessorKey: 'age', header: 'Age', enableSorting: true },
  ]

  return (
    <ThemeProvider theme={theme}>
      <Container >
        <Box
          sx={{
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <Paper
            sx={{
              overflow: "hidden",
              borderRadius: "16px",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
            }}
          >
            <MaterialReactTable
              columns={columns}
              data={tableData}

              // ✅ Enable All Useful Features
              enableSorting
              enableColumnFilters
              enableColumnPinning
              enableRowSelection
              enableColumnActions
              enableDensityToggle
              enableStickyHeader
              enableStickyFooter
              enableGlobalFilter
              enablePagination
              enableGrouping
              enableMultiSort
              enableRowNumbers
              enableSelectAll
              enableColumnResizing
              enableColumnVirtualization
              layoutMode="grid"
              // ✅ Editing Setup (Use muiTableBodyRowProps)
              enableEditing
              debugTable={true} // ✅ Shows MRT logs in console
              muiTableBodyRowProps={({ row }) => ({
                onDoubleClick: () => console.log(`Editing row: ${row.original.id}`),
                sx: { cursor: 'pointer' },
              })}
              onEditingRowSave={({ values }) => {
                setTableData((prevData) =>
                  prevData.map((row) => (row.id === values.id ? values : row))
                );
              }}
              muiTableContainerProps={{
                sx: {
                  overflowX: 'auto', // Ensures scrolling only appears when needed
                  maxWidth: '100%', // Prevents unnecessary stretching
                },
              }}
              muiTableHeadCellProps={{
                sx: {
                  backgroundColor: "#4A90E2",
                  color: "#fff",
                  fontWeight: "bold",
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
