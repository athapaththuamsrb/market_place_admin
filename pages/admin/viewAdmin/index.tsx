import { NextPage } from "next";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowParams,
  GridToolbarContainer,
  GridToolbarExport,
  GridColDef,
} from "@mui/x-data-grid";
import { Box, Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VerifiedIcon from "@mui/icons-material/Verified";
import { useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import GroupIcon from "@mui/icons-material/Group";
import { Container } from "@mui/system";
import PopUp from "../../../components/Admin/Popup";

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

const reportedUsers: NextPage = (props) => {
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      type: "string",
      align: "center",
      width: 50,
    },
    {
      field: "User_ID",
      headerName: "User_ID",
      type: "string",
      align: "center",
      width: 250,
    },
    {
      field: "Name",
      headerName: "Name",
      type: "string",
      align: "center",
      width: 150,
    },
    {
      field: "Date",
      headerName: "Joined Date",
      type: "Date",
      align: "center",
      width: 100,
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
      field: "actions",
      headerName: "Review",
      type: "actions",
      width: 100,
      align: "center",
      getActions: (params: GridRowParams) => [
        <Tooltip title="Delete admin">
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
      users.find((row: { id: any }) => row.id === id)
    );
    console.log(selectedRowsData);
  };
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/users")
      .then((res) => res.json())
      .then((data) => {
        setAdmins(data.filter((user) => user.Type === "Admin"));
        setUsers(data);
      });
  }, [openPopup, open]);

  const handleClickOpen = (id: string) => {
    setOpen(true);
    setId(id);
  };

  const handleClose = (result: string, id: string) => () => {
    setOpen(false);
    if (result == "Yes") {
      const user: { id: string; Type: string } = admins.find(
        (user) => user.id === id
      );
      console.log(user);
      user.Type = "User";
      const res = fetch(`http://localhost:8000/users/${user.id}`, {
        method: "PUT",
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  };
  return (
    <div>
      <Box
        sx={{
          flexGrow: 1,
          position: "relative",
          width: "145px",
          left: "75%",
          marginTop: "100px",
          marginBottom: "10px",
          height: 40,
          borderRadius: "10px",
        }}
      >
        <Button
          onClick={() => setOpenPopup(true)}
          type="submit"
          color="primary"
          variant="contained"
          endIcon={<GroupIcon />}
        >
          Add Admin
        </Button>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          width: "72%",
          marginX: "auto",
          marginTop: "10px",
          marginBottom: "100px",
          height: 750,
          backgroundColor: "white",
          borderRadius: "10px",
        }}
      >
        <DataGrid
          sx={{ m: 2 }}
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
          {"Confirm Block User " + id + "?"}
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
        setUsers={setUsers}
      ></PopUp>
    </div>
  );
};

export default reportedUsers;
