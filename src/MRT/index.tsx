import {useMemo, useState } from 'react';
import SearchIcon from "@mui/icons-material/Search";

import {
  MRT_EditActionButtons,
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_TableOptions,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import {  fakeData, usStates } from './makeData';
import EditIcon from '@mui/icons-material/Edit';
import { User } from '../Types/user';



export const Example = () => {
  
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});
  
  //should be memoized or stable to avioid recreating the columns on every render
  const data = useMemo(()=> fakeData,[])

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'name.firstName',
        header: 'First Name',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.firstName,
          helperText: validationErrors?.firstName,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              firstName: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        },
      },
      {
        accessorKey: 'name.lastName',
        header: 'Last Name',
        muiTableHeadCellProps: { style: { color: 'green' } },
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.lastName,
          helperText: validationErrors?.lastName,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              lastName: undefined,
            }),
        },
      },
      {
        enableClickToCopy: true,
        accessorKey: 'email',
        header: 'Email',
        Header: <i style={{ color: 'red' }}>Email</i>,
        muiEditTextFieldProps: {
          type: 'email',
          required: true,
          error: !!validationErrors?.email,
          helperText: validationErrors?.email,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              email: undefined,
            }),
        },
      },
      {
        accessorKey: 'state',
        header: 'State',
        enableHiding: false, //disable a feature for this column
        editVariant: 'select',
        editSelectOptions: usStates,
        enableGlobalFilter: false,
        muiTableHeadCellProps: ({ column }) => ({
          sx: {
            color: column.getIsSorted() ? 'aqua' : 'black',
          },
        }),
        muiEditTextFieldProps: {
          select: true,
          error: !!validationErrors?.state,
          helperText: validationErrors?.state,
        },
      },
    ],
    [validationErrors],
  );


  function updateUser(updatedInfo: User) {
    const updatedData = fakeData.map(user => {
      // If the user's ID matches, update the user's information
      if (user.id === updatedInfo.id) {
        return { ...user, ...updatedInfo };
      }
      // Otherwise, return the user as is
      return user;
    });
  
    return updatedData;
  }

  //UPDATE action
  const handleSaveUser: MRT_TableOptions<User>['onEditingRowSave'] = async ({
    values,
    table,
  }) => {
    const newValidationErrors = validateUser(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await updateUser(values);
    table.setEditingRow(null); //exit editing mode
  };

  const table = useMaterialReactTable({
    columns,
    data: data,
    editDisplayMode: 'modal', //default ('row', 'cell', 'table', and 'custom' are also available)
    enableEditing: true,
    initialState:{ showGlobalFilter: true }, //now the search input is visible as default
    getRowId: (row) => row.id,
    renderTopToolbarCustomActions: ({ table }) => {
      const hasFilters = table.getState().columnFilters.length > 0;
      const hasSorting = table.getState().sorting.length > 0;
      const isPaginated = table.getState().pagination.pageIndex !== 0;

      const showResetButton = hasFilters || hasSorting || isPaginated; //check if there is any change to in itial value before showing reset button

      return showResetButton ? (
          <Button
              variant="outlined" // or "contained"
              color="primary" onClick={() => {
                  table.resetColumnFilters();
                  table.resetSorting();
                  table.resetPagination();
              }}
          >
              Reset table
          </Button>
      ) : null;
  },
            
    muiSearchTextFieldProps: {
      variant: "outlined",
      placeholder: "Search...",
      InputProps: {
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="primary" />
          </InputAdornment>
        ),
      },
    },
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveUser,
  
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Edit User</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {internalEditComponents} {/* or render custom edit components here */}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      
      </Box>
    ),

   
  });

  return <MaterialReactTable table={table} />;
};

const validateRequired = (value: string) => !!value.length;
const validateEmail = (email: string) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );

function validateUser(user: User) {
  return {
    firstName: !validateRequired(user.name.firstName)
      ? 'First Name is Required'
      : '',
    lastName: !validateRequired(user.name.lastName) ? 'Last Name is Required' : '',
    email: !validateEmail(user.email) ? 'Incorrect Email Format' : '',
  };
}
