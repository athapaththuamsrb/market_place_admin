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
  GridActionsCellItem,
  GridRowParams,
  GridToolbarContainer,
  GridToolbarExport,
  GridColDef,
} from "@mui/x-data-grid";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";

import BlockIcon from "@mui/icons-material/Block";
import VerifiedIcon from "@mui/icons-material/Verified";
import { SetStateAction, useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import Link from "next/link";

const reportedUsers: NextPage = (props) => {
  // const col:{
  //   field: string;
  //   headerName: string;
  //   type: string;
  //   width: number;
  //   align: string;
  // }[]={}
  const columns = [
    {
      field: "id",
      headerName: "ID",
      type: "number",
      width: 50,
      align: "center",
    },
    {
      field: "User_ID",
      headerName: "User_ID",
      type: "string",
      width: 300,
      align: "center",
    },
    {
      field: "Name",
      headerName: "Name",
      type: "string",
      width: 250,
      align: "center",
    },
    {
      field: "Date",
      headerName: "Joined Date",
      type: "Date",
      width: 150,
      align: "center",
    },
    {
      field: "Total",
      headerName: "Total NFTs",
      type: "Number",
      width: 150,
      align: "center",
    },
    {
      field: "Created",
      headerName: "Created NFTs",
      type: "Number",
      width: 150,
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
      width: 150,
      align: "center",
    },
    {
      field: "actions",
      type: "actions",
      width: 200,
      headerName: "View",
      getActions: (params: GridRowParams) => [
        <Button variant="solid" color="primary">
          <Link href={`/admin/users/${params.row.id}`}>
            <a>View Account</a>
          </Link>
        </Button>,
      ],
    },
  ];

  const [rows, setRows] = useState();
  const [id, setId] = useState("");

  useEffect(() => {
    fetch("/api/rows")
      .then((res) => res.json())
      .then((data) => setRows(data));
  }, []);

  const onRowsSelectionHandler = (ids: { id: string }[]) => {
    const selectedRowsData = ids.map((id) => rows.find((row) => row.id === id));
    console.log(selectedRowsData);
  };
  const handleRowClick = (params) => {
    console.log(params.row.id);
  };

  const directPage = () => {
    return <Link href="/admin/report/user"></Link>;
  };

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }
  return (
    <div>
      <Box
        sx={{
          flexGrow: 1,
          width: "85%",
          marginX: "auto",
          marginTop: "100px",
          marginBottom: "100px",
          height: 750,
          backgroundColor: "white",
          borderRadius: "5px",
        }}
      >
        <DataGrid
          sx={{ m: 0 }}
          rows={rows}
          columns={columns}
          pageSize={11}
          rowsPerPageOptions={[5]}
          onSelectionModelChange={(id) => setId(id)}
          onRowClick={(id) => handleRowClick(id)}
          components={{
            Toolbar: CustomToolbar,
          }}
        />
      </Box>
    </div>
  );
};

export default reportedUsers;
