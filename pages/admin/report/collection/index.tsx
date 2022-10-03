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
  DialogTitle,
  Typography,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import GroupIcon from "@mui/icons-material/Group";
import PopUp from "../../../../components/Admin/Popup";
import { User } from "../../../../src/interfaces";
import AdminMenu from "../../../../components/Admin/AdminMenu";
import Link from "@mui/material/Link";
import Title from "../../../../components/ui/Title";

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

const viewReportedCollections: NextPage = () => {
  const columns = [
    {
      field: "id",
      headerName: "ID",
      type: "string",
      align: "left",
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
      align: "left",
      width: 150,
    },
    {
      field: "Date",
      headerName: "Joined Date",
      type: "Date",
      align: "left",
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
      users.find((row: { id: string }) => row.id === id)
    );
    console.log(selectedRowsData);
  };
  const [admins, setAdmins] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/users")
      .then((res) => res.json())
      .then((data) => {
        setAdmins(data.filter((user: User) => user.Type === "Admin"));
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
      const user: User = admins.find((user) => user.id === id)!;
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
      <Title firstWord="Reported" secondWord="Collections" />
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

export default viewReportedCollections;
