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
import { DataGrid, GridActionsCellItem, GridRowParams } from '@mui/x-data-grid';
import { Box } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import VerifiedIcon from '@mui/icons-material/Verified';

const columns = [
    { field: 'id', headerName: 'ID', width: 50, align: 'center' },
    { field: 'User_ID', headerName: 'User_ID', type:'string', width: 250 },
    { field: 'Name', headerName: 'Name', type:'string', width: 250 },
    { field: 'Date', headerName: 'Joined Date', type: 'Date', width: 150 },
    { field: 'Total', headerName: 'Total NFTs', type: 'Number', width: 150, align: 'center' },
    { field: 'Created', headerName: 'Created NFTs', type: 'Number', width: 150, align: 'center' },
    { field: 'Volume', headerName: 'Total volume', type: 'Number', width: 150, align: 'center' },
    { field: 'actions',type: 'actions', width: 150,headerName: 'Review', getActions: (params: GridRowParams) => [
          <GridActionsCellItem icon={<DeleteIcon />}  label="Delete" />, <GridActionsCellItem icon={<VerifiedIcon />}  label="Verify" /> //onaction to be put
          //onClick={toggleAdmin(params.id)}
        ]
    },
];
  
  const rows = [
    { id: 1, User_ID: '0x84eBf03cb02370eaCa1F0Ac93ee59081d263A7f3', Name: 'John', Date: '2022/04/05', Total: 6, Created: 8, Volume: 10},
    { id: 2, User_ID: '0x84eBf03cb02370eaCa1F0Ac93ee59081d263A7f3', Name: 'Mary', Date: '2022/04/05', Total: 6, Created: 8, Volume: 10},
    { id: 3, User_ID: '0x84eBf03cb02370eaCa1F0Ac93ee59081d263A7f3', Name: 'Gihan', Date: '2022/04/05', Total: 6, Created: 8, Volume: 10},
    { id: 4, User_ID: '0x84eBf03cb02370eaCa1F0Ac93ee59081d263A7f3', Name: 'Kalum', Date: '2022/04/05', Total: 6, Created: 8, Volume: 10},
    { id: 5, User_ID: '0x84eBf03cb02370eaCa1F0Ac93ee59081d263A7f3', Name: 'Arin', Date: '2022/04/05', Total: 6, Created: 8, Volume: 10},
    { id: 6, User_ID: '0x84eBf03cb02370eaCa1F0Ac93ee59081d263A7f3', Name: 'Sindy', Date: '2022/04/05', Total: 6, Created: 8, Volume: 10},
    { id: 7, User_ID: '0x84eBf03cb02370eaCa1F0Ac93ee59081d263A7f3', Name: 'july', Date: '2022/04/05', Total: 6, Created: 8, Volume: 10},
    { id: 8, User_ID: '0x84eBf03cb02370eaCa1F0Ac93ee59081d263A7f3', Name: 'John', Date: '2022/04/05', Total: 6, Created: 8, Volume: 10},
    { id: 9, User_ID: '0x84eBf03cb02370eaCa1F0Ac93ee59081d263A7f3', Name: 'Mary', Date: '2022/04/05', Total: 6, Created: 8, Volume: 10},
    { id: 10, User_ID: '0x84eBf03cb02370eaCa1F0Ac93ee59081d263A7f3', Name: 'Gihan', Date: '2022/04/05', Total: 6, Created: 8, Volume: 10},
    { id: 11, User_ID: '0x84eBf03cb02370eaCa1F0Ac93ee59081d263A7f3', Name: 'Kalum', Date: '2022/04/05', Total: 6, Created: 8, Volume: 10},
    { id: 12, User_ID: '0x84eBf03cb02370eaCa1F0Ac93ee59081d263A7f3', Name: 'Arin', Date: '2022/04/05', Total: 6, Created: 8, Volume: 10},
    { id: 13, User_ID: '0x84eBf03cb02370eaCa1F0Ac93ee59081d263A7f3', Name: 'Sindy', Date: '2022/04/05', Total: 6, Created: 8, Volume: 10},
    { id: 14, User_ID: '0x84eBf03cb02370eaCa1F0Ac93ee59081d263A7f3', Name: 'july', Date: '2022/04/05', Total: 6, Created: 8, Volume: 10},
  ];

  const onRowsSelectionHandler = (ids) => {
    const selectedRowsData = ids.map((id) => rows.find((row) => row.id === id));
    console.log(selectedRowsData);
  };

const reportedUsers: NextPage = () =>{
    return (
        
        <Box sx={{ flexGrow: 1, width: "72%", marginX: "auto", marginY: "100px",height: 750, backgroundColor:"white",  borderRadius: '10px'}}>
           <DataGrid
                sx={{ m: 2 }} 
                rows={rows}
                columns={columns} 
                pageSize={12}
                rowsPerPageOptions={[5]}
                onSelectionModelChange={(id) => onRowsSelectionHandler(id)}
            />
        </Box>
      );
}

export default reportedUsers