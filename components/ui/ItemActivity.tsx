import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { FC } from "react";
import { Activity, User } from "../../src/interfaces";

type ActivityProps = {
  activity: Activity[];
};

const ItemActivity: FC<ActivityProps> = ({ activity }) => {
  const columns = [
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
      field: "to",
      headerName: "To",
      type: "string",
      width: 130,
    },

    {
      field: "from",
      headerName: "From",
      type: "string",
      width: 130,
    },
    {
      field: "date",
      headerName: "Date",
      type: "string",
      width: 100,
    },
  ];
  return (
    <div>
      <Box
        sx={{
          flexGrow: 1,
          width: "100%",
          height: 300,
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
