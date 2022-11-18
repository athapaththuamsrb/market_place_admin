import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { Box, Button, Link } from "@mui/material";
import { FC } from "react";
import { Activity, User } from "../../src/interfaces";

type ActivityProps = {
  activity: Activity[];
};

const ItemActivity: FC<ActivityProps> = ({ activity }) => {
  function getToID(params: GridRenderCellParams) {
    return [`${params.row.toID}`, `${params.row.to}`];
  }

  function getFromID(params: GridRenderCellParams) {
    return [`${params.row.fromID}`, `${params.row.from}`];
  }

  const columns: GridColDef[] = [
    {
      field: "event",
      headerName: "Event",
      type: "string",
      width: 100,
    },
    {
      field: "price",
      headerName: "Price (ETH)",
      type: "string",
      width: 100,
    },
    {
      field: "actions1",
      headerName: "From",
      width: 130,
      renderCell: (params: GridRenderCellParams<String>) => (
        <div>
          {getFromID(params)[0] !== "" ? (
            <Link href={`../../user/${getFromID(params)[0]}`}>
              {getFromID(params)[1]}
            </Link>
          ) : (
            <div>{getFromID(params)[1]}</div>
          )}
        </div>
      ),
    },
    {
      field: "actions2",
      headerName: "To",
      width: 130,
      renderCell: (params: GridRenderCellParams<String>) => (
        <div>
          {getToID(params)[0] !== "" ? (
            <Link href={`../../user/${getToID(params)[0]}`}>
              {getToID(params)[1]}
            </Link>
          ) : (
            <div>{getToID(params)[1]}</div>
          )}
        </div>
      ),
    },
    {
      field: "date",
      headerName: "Date",
      type: "string",
      width: 200,
    },
  ];
  return (
    <div>
      <Box
        sx={{
          flexGrow: 1,
          width: "100%",
          height: 400,
        }}
      >
        <DataGrid
          sx={{
            fontWeight: 400,
            align: "center",
            borderRadius: "10px",
          }}
          rows={activity}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </Box>
    </div>
  );
};

export default ItemActivity;
