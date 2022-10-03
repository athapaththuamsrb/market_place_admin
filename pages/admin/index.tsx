// admin
// admin/addAdmin
// admin/viewAdmin
// admin/user/[id]
// admin/report/users
// admin/report/users/[id]
// admin/report/nft
// admin/report/nft/[id]
// admin/report/collection
// admin/report/collection/[id]
import { NextPage } from "next";
import {
  DataGrid,
  GridActionsColDef,
  GridColDef,
  GridRowParams,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Title from "../../components/ui/Title";
import AdminMenu from "../../components/Admin/AdminMenu";
import Link from "@mui/material/Link";
import AddCircleIcon from '@mui/icons-material/AddCircle';

const allUsers: NextPage = () => {
  const column = [
    {
      field: "id",
      headerName: "ID",
      type: "string",
      width: 50,
      align: "left",
    },
    {
      field: "User_ID",
      headerName: "User_ID",
      type: "string",
      width: 250,
      align: "center",
    },
    {
      field: "Name",
      headerName: "Name",
      type: "string",
      width: 150,
      align: "left",
    },
    {
      field: "Date",
      headerName: "Joined Date",
      type: "Date",
      width: 100,
      align: "left",
    },
    {
      field: "Total",
      headerName: "Total NFTs",
      type: "Number",
      width: 100,
      align: "center",
    },
    {
      field: "Created",
      headerName: "Created NFTs",
      type: "Number",
      width: 100,
      align: "center",
    },
    {
      field: "Volume",
      headerName: "Total volume",
      type: "Number",
      width: 150,
      align: "center",
    },
    {
      field: "Status",
      headerName: "Status",
      type: "string",
      width: 100,
      align: "left",
    },
    {
      field: "actions",
      type: "actions",
      width: 200,
      headerName: "View",
      getActions: (params: GridRowParams) => [
        <Button variant="outlined" color="primary" sx={{ color: "black" }}>
          <Link href={`/admin/users/${params.row.id}`} underline="hover">
            <a>View Account</a>
          </Link>
        </Button>,
      ],
    },
  ];

  const [rows, setRows] = useState([]);
  const [id, setId] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/users")
      .then((res) => res.json())
      .then((data) => setRows(data));
  }, []);

  function CustomToolbar() {
    return (
      <GridToolbarContainer
        sx={{
          backgroundColor: "#FCFCFC",
        }}
      >
        <GridToolbarExport
          sx={{
            mx: 1,
            color: "white",
            backgroundColor: "#CA82FF",
            marginY: 0.15,
            fontSize: 16,
          }}
        />
      </GridToolbarContainer>
    );
  }
  return (
    <div>
      <Title firstWord="Admin" secondWord="Dashboard" />

      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Link href="/admin/viewAdmin" underline="none">
          <Button
            size="small"
            color="secondary"
            variant="contained"
            endIcon={<AddCircleIcon color="disabled" />}
            sx={{
              marginX: "20px",
            }}
          >
            <Typography color="white" variant="h6" sx={{ fontWeight: 500 }}>
              Admin Panel
            </Typography>
          </Button>
        </Link>
        <AdminMenu />
      </Grid>

      <Box
        sx={{
          flexGrow: 1,
          width: "72%",
          marginX: "auto",
          marginTop: "10px",
          marginBottom: "50px",
          height: 750,
          backgroundColor: "white",
          borderRadius: "10px",
        }}
      >
        <DataGrid
          sx={{
            m: 2,
            fontWeight: 400,
            align: "center",
            backgroundColor: "#fcfcfc",
            borderRadius: "10px",
          }}
          rows={rows}
          columns={column}
          rowsPerPageOptions={[5]}
          components={{
            Toolbar: CustomToolbar,
          }}
        />
      </Box>
    </div>
  );
};

export default allUsers;
