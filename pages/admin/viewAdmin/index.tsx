import { NextPage } from "next";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowParams,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VerifiedIcon from "@mui/icons-material/Verified";
import { useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import GroupIcon from "@mui/icons-material/Group";
import { Container } from "@mui/system";
import PopUp from "../../../components/popup";

const columns = [
  { field: "id", headerName: "ID", width: 50, align: "center" },
  { field: "User_ID", headerName: "User_ID", type: "string", width: 250 },
  { field: "Name", headerName: "Name", type: "string", width: 150 },
  { field: "Date", headerName: "Joined Date", type: "Date", width: 100 },
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
    type: "actions",
    width: 100,
    headerName: "Review",
    getActions: (params: GridRowParams) => [
      <Tooltip title="Delete admin">
        <GridActionsCellItem icon={<DeleteIcon />} label="Delete" />
      </Tooltip>,
      <Tooltip title="Verify admin">
        <GridActionsCellItem icon={<VerifiedIcon />} label="Verify" />
      </Tooltip>, //onaction to be put
      //onClick={toggleAdmin(params.id)}
    ],
  },
];

const onRowsSelectionHandler = (ids: any[]) => {
  const selectedRowsData = ids.map((id: any) =>
    rows.find((row: { id: any }) => row.id === id)
  );
  console.log(selectedRowsData);
};

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

const reportedUsers: NextPage = () => {
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/users")
      .then((res) => res.json())
      .then((data) => {
        setAdmins(data.filter((user) => user.Type === "Admin"));
        setUsers(data);
      });
  }, [openPopup]);

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
