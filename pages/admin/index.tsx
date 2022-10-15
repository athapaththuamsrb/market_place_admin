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
import { Box, Button, Grid, LinearProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Title from "../../components/ui/Title";
import AdminMenu from "../../components/Admin/AdminMenu";
import Link from "@mui/material/Link";
import GroupIcon from "@mui/icons-material/Group";
import axios from "axios";

const AllUsers: NextPage = (props) => {
  const column = [
    {
      field: "id",
      headerName: "ID",
      type: "string",
      width: 50,
    },
    {
      field: "User_ID",
      headerName: "User_ID",
      type: "string",
      width: 300,
    },
    {
      field: "Name",
      headerName: "Name",
      type: "string",
      width: 200,
    },
    {
      field: "Date",
      headerName: "Joined Date",
      type: "Date",
      width: 100,
    },
    {
      field: "Total",
      headerName: "Total NFTs",
      type: "Number",
      width: 100,
    },
    {
      field: "Created",
      headerName: "Created NFTs",
      type: "Number",
      width: 100,
    },
    {
      field: "Volume",
      headerName: "Total volume",
      type: "Number",
      width: 150,
    },
    {
      field: "Status",
      headerName: "Status",
      type: "string",
      width: 100,
    },
    {
      field: "actions",
      type: "actions",
      width: 200,
      headerName: "View",
      getActions: (params: GridRowParams) => [
        <Button
          variant="outlined"
          color="primary"
          key={params.row.id}
          sx={{ color: "black" }}
        >
          <Link href={`/admin/users/${params.row.id}`} underline="hover">
            <a>View Account</a>
          </Link>
        </Button>,
      ],
    },
  ];

  const [rows, setRows] = useState([]);
  const [id, setId] = useState("");
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      axios
        .get("http://localhost:8000/users")
        .then((res) => {
          setRows(res.data);
          setIsPending(false);
          setError(null);
        })
        .catch((error) => {
          setIsPending(false);
          setError(error.message);
        });
    }, 300);
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
      {isPending && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      )}
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
            endIcon={<GroupIcon color="disabled" />}
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
          width: "90%",
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

export default AllUsers;
