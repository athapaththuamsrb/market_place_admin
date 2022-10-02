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
import {
  Box,
  Button,
} from "@mui/material";

import { useEffect, useState } from "react";
import Link from "next/link";

const allUsers: NextPage = () => {
  // const col:{
  //   field: string;
  //   headerName: string;
  //   type: string;
  //   width: number;
  //   align: string;
  // }[]={}
  const column =  [
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
        <Button variant="outlined" color="primary">
          <Link href={`/admin/users/${params.row.id}`}>
            <a>View Account</a>
          </Link>
        </Button>,
      ],
    },
  ];

  const [rows, setRows] = useState([]);
  const [id, setId] = useState("");

  useEffect(() => {
    fetch("/api/rows")
      .then((res) => res.json())
      .then((data) => setRows(data));
  }, []);

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