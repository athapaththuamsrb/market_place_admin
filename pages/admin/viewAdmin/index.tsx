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
import PopUp from "../../../components/Admin/Popup";
import { User } from "../../../src/interfaces";
import AdminMenu from "../../../components/Admin/AdminMenu";
import Link from "@mui/material/Link";
import Title from "../../../components/ui/Title";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import axios from "axios";

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

const ViewAdmins: NextPage = (props) => {
  const columns = [
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
      width: 400,
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
          <Link href={`../users/${params.row.id}`} underline="hover">
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
    console.log(selectedRowsData);
  };
  const [admins, setAdmins] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      axios
        .get("http://localhost:8000/users")
        .then((res) => {
          setUsers(res.data);
          setAdmins(res.data.filter((user: User) => user.Type === "Admin"));
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
      console.log(user);
      user.Type = "User";
      setTimeout(() => {
        axios
          .put(`http://localhost:8000/users/${user.id}`, user)
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

      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Link href="/admin" underline="none">
          <Button
            size="small"
            color="secondary"
            variant="contained"
            endIcon={<GroupIcon color="disabled" />}
            sx={{
              marginX: "10px",
            }}
          >
            <Typography color="white" variant="h6" sx={{ fontWeight: 500 }}>
              Admin Dashboard
            </Typography>
          </Button>
        </Link>
        <AdminMenu />
        <Button
          onClick={() => setOpenPopup(true)}
          type="submit"
          size="small"
          color="secondary"
          variant="contained"
          endIcon={<AddCircleIcon color="disabled" />}
          sx={{
            marginX: "10px",
          }}
        >
          <Typography color="white" variant="h6" sx={{ fontWeight: 500 }}>
            Add Admin
          </Typography>
        </Button>
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
          rows={admins}
          columns={columns}
          pageSize={12}
          rowsPerPageOptions={[5]}
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
