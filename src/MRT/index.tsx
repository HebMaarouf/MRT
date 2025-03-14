import {MaterialReactTable} from "material-react-table";

const data = [
  { id: 1, firstName: "John", lastName: "Doe", age: 30 },
  { id: 2, firstName: "Jane", lastName: "Smith", age: 25 },
  { id: 3, firstName: "Alice", lastName: "Johnson", age: 28 },
];

const columns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "firstName", header: "First Name" },
  { accessorKey: "lastName", header: "Last Name" },
  { accessorKey: "age", header: "Age" },
];

const MRT = () => {
  return <MaterialReactTable columns={columns} data={data} />;
};

export default MRT;