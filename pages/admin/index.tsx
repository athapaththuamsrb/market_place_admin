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
import { User } from "../../src/interfaces";
import theme from "../../src/theme";

const AllUsers: NextPage = (props) => {
  const column = [
    {
      field: "id",
      headerName: "ID",
      type: "string",
      width: 100,
    },
    {
      field: "User_ID",
      headerName: "Wallet Address",
      type: "string",
      width: 500,
    },
    {
      field: "Name",
      headerName: "Name",
      type: "string",
      width: 200,
    },
    /*{
      field: "Total",
      headerName: "Total NFTs",
      type: "string",
      width: 100,
    },
    {
      field: "Created",
      headerName: "Created NFTs",
      type: "string",
      width: 100,
    },
    {
      field: "Collections",
      headerName: "Created Collections",
      type: "string",
      width: 150,
    },*/
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
          <Link href={`view/user/${params.row.id}`} underline="hover">
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
        .get("api/getUsers")
        .then((res) => {
          console.log(res.data.data);
          setRows(res.data.data.filter((data: User) => data.Type === "USER"));
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
          backgroundColor: "white",
        }}
      >
        <GridToolbarExport
          sx={{
            mx: 1,
            color: "white",
            backgroundColor: "#c9c9c9",
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
      <Typography variant="h2" align="center" marginBottom={3}>
        Exclusives Users
      </Typography>
      <Box
        marginTop={5}
        textAlign={"center"}
        display="flex"
        justifyContent="space-evenly"
      >
        <Grid
          container
          rowSpacing={2}
          columnSpacing={{ xs: 1, sm: 1, md: 1 }}
          sx={{ maxWidth: "80%" }}
        >
          <Grid alignSelf={"center"} item xs={12} sm={12} md={6}>
            <Link href="/admin/viewAdmin" underline="none">
              <Button
                size="small"
                color="secondary"
                variant="contained"
                endIcon={<GroupIcon color="disabled" />}
                sx={{
                  minWidth: "40%",
                  height: "50px",
                  borderRadius: 3,
                }}
              >
                <Typography
                  color="white"
                  variant="h6"
                  sx={{
                    [theme.breakpoints.down("sm")]: {
                      fontWeight: 600,
                      fontSize: 15,
                    },
                  }}
                >
                  Admin Panel
                </Typography>
              </Button>
            </Link>
          </Grid>
          <Grid alignSelf={"center"} item xs={12} sm={12} md={6}>
            <AdminMenu />
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          width: "60%",
          marginX: "auto",
          marginTop: "10px",
          marginBottom: "50px",
          height: 600,
          backgroundColor: "white",
          borderRadius: "10px",
        }}
      >
        <DataGrid
          sx={{
            m: 0,
            fontWeight: 400,
            align: "center",
            backgroundColor: "#fcfcfc",
            borderRadius: "10px",
          }}
          rows={rows}
          columns={column}
          //rowsPerPageOptions={[5]}
          components={{
            Toolbar: CustomToolbar,
          }}
        />
      </Box>
    </div>
  );
};

export default AllUsers;
