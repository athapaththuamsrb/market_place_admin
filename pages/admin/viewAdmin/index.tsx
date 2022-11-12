import { NextPage } from "next";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowParams,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Grid,
  LinearProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import GroupIcon from "@mui/icons-material/Group";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PopUp from "../../../components/Admin/Popup";
import { User } from "../../../src/interfaces";
import Link from "@mui/material/Link";
import Title from "../../../components/ui/Title";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import axios from "axios";
import { useGetMyProfile } from "../../../components/hooks/useHook";
import theme from "../../../src/theme";

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

const ViewAdmins: NextPage = (props) => {
  const columns = [
    // {
    //   field: "id",
    //   headerName: "ID",
    //   type: "string",
    //   width: 100,
    // },
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
    },*/
    {
      field: "Owned",
      headerName: "Owned NFT count",
      type: "string",
      width: 160,
    },
    {
      field: "Collections",
      headerName: "Collection count",
      type: "string",
      width: 150,
    },
    {
      field: "Status",
      headerName: "Status",
      type: "string",
      width: 150,
    },
    {
      field: "actions",
      headerName: "Review",
      type: "actions",
      width: 200,
      getActions: (params: GridRowParams) => [
        <Button
          variant="outlined"
          color="primary"
          key={params.row.id}
          sx={{ color: "black" }}
        >
          <Link href={`../view/user/${params.row.id}`} underline="hover">
            <a>View Account</a>
          </Link>
        </Button>,
        <Tooltip title="Delete admin" key={params.row.id}>
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleClickOpen(params.row.id)}
          />
        </Tooltip>,
      ],
    },
  ];

  const onRowsSelectionHandler = (ids: any[]) => {
    const selectedRowsData = ids.map((id: any) =>
      users.find((row: { id: string }) => row.id === id)
    );
    // console.log(selectedRowsData);
  };
  const [admins, setAdmins] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const { profile, isPendingProfile, errorProfile, isAdmin, isSuperAdmin } =
    useGetMyProfile();

  useEffect(() => {
    setTimeout(() => {
      axios
        .get("../api/getUsers")
        .then((res) => {
          setUsers(res.data.data);
          setAdmins(
            res.data.data.filter(
              (user: User) =>
                user.Type === "ADMIN" || user.Type === "SUPER_ADMIN"
            )
          );
          setIsPending(false);
          setError(null);
        })
        .catch((error) => {
          setIsPending(false);
          setError(error.message);
        });
    }, 300);
  }, [openPopup, open]);

  const handleClickOpen = (id: string) => {
    setOpen(true);
    setId(id);
  };
  const handleClose = (result: string, id: string) => () => {
    setOpen(false);
    if (result == "Yes") {
      const user: User = admins.find((user) => user.id === id)!;
      // console.log(user);
      user.Type = "User";
      setTimeout(() => {
        axios
          // .put(`http://localhost:8000/users/${user.id}`, user)
          .post("../../api/deleteAdmin", {
            data: {
              id: user.id,
            },
          })
          .then(() => {
            setIsPending(false);
            setError(null);
          })
          .catch((error) => {
            setIsPending(false);
            setError(error.message);
          });
      });
    }
  };

  return (
    <div>
      {isPending && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      )}
      <Title firstWord="Admin" secondWord="Panel" />
      <Box textAlign={"center"} display="flex" justifyContent="space-evenly">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          rowSpacing={2}
          columnSpacing={{ xs: 1, sm: 1, md: 1 }}
          sx={{ maxWidth: "80%" }}
        >
          <Grid alignSelf={"center"} item xs={12} sm={12} md={6}>
            <Link href="/admin" underline="none">
              <Button
                size="small"
                color="secondary"
                variant="contained"
                startIcon={<ArrowBackIcon color="action" fontSize="large" />}
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
                      fontSize: 17,
                    },
                  }}
                >
                  Admin Dashboard
                </Typography>
              </Button>
            </Link>
          </Grid>
          <Grid alignSelf={"center"} item xs={12} sm={12} md={6}>
            {isSuperAdmin && (
              <Button
                onClick={() => setOpenPopup(true)}
                type="submit"
                size="small"
                //color="primary"
                variant="contained"
                endIcon={<AddCircleIcon />}
                sx={{
                  minWidth: "40%",
                  height: "50px",
                  borderRadius: 3,
                  backgroundColor: "black",
                }}
              >
                <Typography
                  color="white"
                  variant="h6"
                  sx={{
                    [theme.breakpoints.down("sm")]: {
                      fontWeight: 600,
                      fontSize: 17,
                    },
                  }}
                >
                  Add Admin
                </Typography>
              </Button>
            )}
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          width: "75%",
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
          rows={admins}
          columns={columns}
          pageSize={12}
          //rowsPerPageOptions={[5]}
          onSelectionModelChange={(id) => onRowsSelectionHandler(id)}
          components={{
            Toolbar: CustomToolbar,
          }}
        />
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Are you sure?"}
          <Typography variant="h6" sx={{ fontSize: 14, fontWeight: 300 }}>
            {"Are you sure that you want to remove admin privileges from " +
              id +
              "?"}
          </Typography>
        </DialogTitle>
        <DialogActions>
          <Button autoFocus onClick={handleClose("Yes", id)}>
            Yes
          </Button>
          <Button onClick={handleClose("No", id)} autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
      <PopUp
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        users={users}
      ></PopUp>
    </div>
  );
};

export default ViewAdmins;
