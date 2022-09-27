import { NextPage } from "next";
import {
  DataGrid,
  getDataGridUtilityClass,
  GridActionsCellItem,
  GridRowParams,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

import BlockIcon from '@mui/icons-material/Block';
import VerifiedIcon from "@mui/icons-material/Verified";
import { SetStateAction, useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import { json } from "stream/consumers";
import { getValue } from "@mui/system";
import Link from "next/link";
import { PanoramaSharp } from "@mui/icons-material";

const reportedUsers: NextPage = () => {
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
      width: 300,
      headerName: "Review",
      getActions: (params: GridRowParams) => [
        <Tooltip title="Block User">
          <GridActionsCellItem icon={<BlockIcon />} label="Delete" onClick={()=>(handleClickOpenBlock(params.row.id))}/>
        </Tooltip>,
        <Tooltip title="Verify User">
          <GridActionsCellItem icon={<VerifiedIcon />} label="Verify" onClick={()=> (handleClickOpenVerify(params.row.id))}/>
        </Tooltip>, 
        <Button variant="solid" color="primary">
        <Link href={`users/${params.row.id}`}>
          <a>View Account</a>
        </Link>
      </Button>
      ],
    },
    
  ];  

  const [rows, setRows] = useState([]);
  const [openBlock, setOpenBlock] = useState(false);
  const [openVerify, setOpenVerify] = useState(false);
  const [id,setId] = useState('');
  const [status,setStatus] =  useState('');
  
  useEffect(() => {
    fetch("http://localhost:8000/users")
    .then((res)=> res.json())
    .then((data) => {
      setRows(data.filter((user) => user.Status === "reported"))
    });

  },[openBlock,openVerify]);  
  
    const handleClickOpenBlock = (id) => {
      setOpenBlock(true);
      setId(id);
    };
    
    const handleCloseBlock = (result,id) => () =>{
      setOpenBlock(false)
      if(result=='Yes'){
        const user = rows.find  ((user) => user.id === id);
        console.log(user);
        user.Status="Blocked"
        const res = fetch(`http://localhost:8000/users/${user.id}`,{
            method: 'PUT',
            body: JSON.stringify(user),
            headers:{
                'Content-Type': 'application/json'
            }
        })
      }  
    };

    const handleClickOpenVerify = (id) => {
      setOpenVerify(true);
      setId(id);
    };
    
    const handleCloseVerify = (result,id) =>()=> {
      setOpenVerify(false)
      if(result=='Yes'){
        const User = rows.find((user) => user.id === id);
        User.Status="Active"
        const res = fetch(`http://localhost:8000/users/${User.id}`,{
            method: 'PUT',
            body: JSON.stringify(User),
            headers:{
                'Content-Type': 'application/json'
            }
        })
      }
    };
  
  const onRowsSelectionHandler = (ids) => {
    const selectedRowsData = ids.map((id) => rows.find((row) => row.id === id));
    console.log(selectedRowsData);
    //console.log(rows)
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
          width: "72%",
          marginX: "auto",
          marginTop: "100px",
          marginBottom: "100px",
          height: 750,
          backgroundColor: "white",
          borderRadius: "10px",
        }}
      >
        <DataGrid
          sx={{ m: 2 }}
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
          {"Confirm Block User "+id+"?"}
        </DialogTitle>
        <DialogActions>
          <Button autoFocus onClick={handleCloseBlock('Yes',id)} >
            Yes
          </Button>
          <Button onClick={handleCloseBlock('No',id)} autoFocus>
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
          {"Confirm Verify User "+id+"?"}
        </DialogTitle>
        <DialogActions>
          <Button autoFocus onClick={handleCloseVerify('Yes',id)} >
            Yes
          </Button>
          <Button onClick={handleCloseVerify('No',id)} autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    
  );
};

export default reportedUsers;
