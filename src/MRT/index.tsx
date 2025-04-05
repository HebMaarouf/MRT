import { useMemo, useState } from 'react';
import SearchIcon from "@mui/icons-material/Search";
import { MRT_Localization_AR } from 'material-react-table/locales/ar';
import { MRT_Localization_EN } from 'material-react-table/locales/en';
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_TableOptions,
  useMaterialReactTable,
  MRT_ShowHideColumnsButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFiltersButton,
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
import { fakeData, usStates } from './makeData';
import EditIcon from '@mui/icons-material/Edit';
import { User } from '../Types/user';
import { LanguageToggle } from './languages';
import { useTranslation } from 'react-i18next';


export const Example = () => {

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  //should be memoized or stable to avoid recreating the columns on every render
  const data = useMemo(() => fakeData, [])
  const { t, i18n } = useTranslation();

  const localization = i18n.language === 'ar' ? MRT_Localization_AR : MRT_Localization_EN;

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'id',
        header: t('id'),
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'firstName',
        header: t('fName'),
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
        accessorKey: 'lastName',
        header: t('lName'),
        muiTableHeadCellProps: { style: { color: 'white' } }, //you can change the color like this
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.lastName,
          helperText: validationErrors?.lastName,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              lastName: undefined,
            }),
        },
      },
      {
        accessorKey: 'email',
        header: t('email'),
        Header: <i style={{ color: 'white' }}>{t('email')}</i>, // or you can change the color like this
        enableClickToCopy: true,
        muiEditTextFieldProps: {
          type: 'email',
          required: true,
          error: !!validationErrors?.email,
          helperText: validationErrors?.email,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              email: undefined,
            }),
        },
      },
      {
        accessorKey: 'state',
        header: t('state'),
        enableHiding: false, //disable a feature for this column
        editVariant: 'select',
        editSelectOptions: usStates,
        enableGlobalFilter: false,
        muiTableHeadCellProps: ({ column }) => ({
          sx: {
            color: column.getIsSorted() ? 'aqua' : 'white',
            backgroundColor: '#2b7de2'
          },
        }),
        muiEditTextFieldProps: {
          select: true,
          error: !!validationErrors?.state,
          helperText: validationErrors?.state,
        },
      },
    ],
    [validationErrors, i18n.language],
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
    localization: localization,
    editDisplayMode: 'modal', //default ('row', 'cell', 'table', and 'custom' are also available)
    enableEditing: true,
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: '#2b7de2', // you can give style for all headers here
        color: 'white',
        fontWeight: 'bold',
        textAlign: i18n.language === 'ar' ? 'right' : 'left',
      },
    },
    muiTableBodyCellProps: {
      sx: {
        color: '#212121', 
        fontSize: '14px',
        textAlign: i18n.language === 'ar' ? 'right' : 'left',
      },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '12px',
        border: '1px solid #e0e0e0',
      },
    },
    muiTableBodyRowProps: {
      sx: {
        '&:hover': {
          backgroundColor: '#f5f5f5',
        },
      },
    },
    
    initialState: {
      showGlobalFilter: true, //now the search input is visible as default
      density: 'compact'
    }, 
    
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
          {t('resetTable')}
        </Button>
      ) : null;
    },
    renderToolbarInternalActions: ({ table }) => (
      <>
        {/* add your own language button or something */}
        <LanguageToggle />
        {/* built-in buttons (must pass in table prop for them to work!) */}
        <MRT_ShowHideColumnsButton table={table} />
        <MRT_ToggleFullScreenButton table={table} />
        <MRT_ToggleDensePaddingButton table={table} />
        <MRT_ToggleFiltersButton table={table} />
      </>
    ),
    muiSearchTextFieldProps: {
      variant: "outlined",
      placeholder: t('search'),
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
        <DialogTitle variant="h3">{t('edit')}</DialogTitle>
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
        <Tooltip title={t('edit')}>
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon sx={{ color: '#1976d2', cursor: 'pointer' }} />
          </IconButton>
        </Tooltip>

      </Box>
    ),
  });

  function validateUser(user: User) {
    
    return {
      firstName: !validateRequired(user.firstName)
        ? t('firstNameValidation')
        : '',
      lastName: !validateRequired(user.lastName) ? t('lasttNameValidation') : '',
      email: !validateEmail(user.email) ? t('emailValidation') : '',
    };
  }
  return (
    <Box sx={{ borderRadius: '12px', overflow: 'hidden', boxShadow: 3 }}>
      <MaterialReactTable table={table} />;
    </Box>)

};

const validateRequired = (value: string) => !!value.length;
const validateEmail = (email: string) =>
  !!email.length &&
  email
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );

