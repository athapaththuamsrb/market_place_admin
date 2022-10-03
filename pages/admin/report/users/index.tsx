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
  Grid,
  Link,
  Typography,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import BlockIcon from "@mui/icons-material/Block";
import VerifiedIcon from "@mui/icons-material/Verified";
import { useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import { User } from "../../../../src/interfaces";
import AdminMenu from "../../../../components/Admin/AdminMenu";
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

const reportedUsers: NextPage = () => {
  const columns = [
    { field: "id", headerName: "ID", type: "string", width: 50, align: "left" },
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
      field: "Report Type",
      headerName: "Report Type",
      type: "string",
      width: 200,
      align: "left",
    },

    {
      field: "Date",
      headerName: "Reported Date",
      type: "Date",
      width: 100,
      align: "left",
    },
    {
      field: "actions",
      type: "actions",
      width: 200,
      headerName: "Review",
      getActions: (params: GridRowParams) => [
        <Button variant="outlined" color="primary" sx={{ color: "black" }}>
          <Link href={`users/${params.row.id}`} underline="hover">
            <a>View Account</a>
          </Link>
        </Button>,
        <Tooltip title="Block User">
          <GridActionsCellItem
            icon={<BlockIcon />}
            label="Delete"
            color="error"
            onClick={() => handleClickOpenBlock(params.row.id)}
          />
        </Tooltip>,
        <Tooltip title="Verify User">
          <GridActionsCellItem
            icon={<VerifiedIcon />}
            label="Verify"
            color="success"
            onClick={() => handleClickOpenVerify(params.row.id)}
          />
        </Tooltip>,
      ],
    },
    {
      field: "ReportedBy",
      headerName: "Reported By",
      type: "string",
      width: 250,
      align: "center",
    },
  ];

  const [rows, setRows] = useState<User[]>([]);
  const [openBlock, setOpenBlock] = useState(false);
  const [openVerify, setOpenVerify] = useState(false);
  const [id, setId] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/users")
      .then((res) => res.json())
      .then((data) => {
        setRows(data.filter((user: User) => user.Status === "reported"));
      });
  }, [openBlock, openVerify]);

  const handleClickOpenBlock = (id: string) => {
    setOpenBlock(true);
    setId(id);
  };

  const handleCloseBlock = (result: string, id: string) => () => {
    setOpenBlock(false);
    if (result == "Yes") {
      const user: User = rows.find((user) => user.id === id)!;
      console.log(user);
      user.Status = "Blocked";
      const res = fetch(`http://localhost:8000/users/${user.id}`, {
        method: "PUT",
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  };

  const handleClickOpenVerify = (id: string) => {
    setOpenVerify(true);
    setId(id);
  };

  const handleCloseVerify = (result: string, id: string) => () => {
    setOpenVerify(false);
    if (result == "Yes") {
      const user: User = rows.find((user) => user.id === id)!;
      user.Status = "Active";
      const res = fetch(`http://localhost:8000/users/${user.id}`, {
        method: "PUT",
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  };

  const onRowsSelectionHandler = (ids: any[]) => {
    const selectedRowsData = ids.map((id: any) =>
      rows.find((row: { id: string }) => row.id === id)
    );
    console.log(selectedRowsData);
  };

  return (
    <div>
      <Title firstWord="Reported" secondWord="Users" />
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
          rows={rows}
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
        open={openBlock}
        onClose={handleCloseBlock}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Are you sure?"}
          <Typography variant="h6" sx={{ fontSize: 14, fontWeight: 400 }}>
            {"Are you sure that you want to block " + id + "?"}
          </Typography>
        </DialogTitle>
        <DialogActions>
          <Button autoFocus onClick={handleCloseBlock("Yes", id)}>
            Yes
          </Button>
          <Button onClick={handleCloseBlock("No", id)} autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openVerify}
        onClose={handleCloseVerify}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Are you sure?"}
          <Typography variant="h6" sx={{ fontSize: 14, fontWeight: 400 }}>
            {"Are you sure that you want to verify user " + id + "?"}
          </Typography>
        </DialogTitle>
        <DialogActions>
          <Button autoFocus onClick={handleCloseVerify("Yes", id)}>
            Yes
          </Button>
          <Button onClick={handleCloseVerify("No", id)} autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default reportedUsers;
