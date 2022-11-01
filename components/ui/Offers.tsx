import { NextPage } from "next";
import { DataGrid, GridRowParams } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import { User } from "../../src/interfaces";
import axios from "axios";

const Offers: NextPage = (props) => {
  const columns = [
    {
      field: "User_ID",
      headerName: "Price",
      type: "string",
      width: 150,
    },
    {
      field: "Name",
      headerName: "USD Price",
      type: "string",
      width: 150,
    },
    {
      field: "reportType",
      headerName: "Expiration",
      type: "string",
      width: 150,
    },

    {
      field: "reportedDate",
      headerName: "Floor Difference",
      type: "Date",
      width: 150,
    },
    {
      field: "reportedBy",
      headerName: "From",
      type: "string",
      width: 150,
    },
    {
      field: "actions",
      type: "actions",
      width: 200,
      headerName: "Review",
      getActions: (params: GridRowParams) => [
        <Button
          variant="outlined"
          color="primary"
          key={params.row.id}
          sx={{ color: "black" }}
          onClick={() => handleClickOpenVerify(params.row.id)}
        >
          <a>Accept</a>
        </Button>,
      ],
    },
  ];

  const [rows, setRows] = useState<User[]>([]);
  const [openVerify, setOpenVerify] = useState(false);
  const [id, setId] = useState("");
  const [status, setStatus] = useState("");
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      axios
        .get("http://localhost:8000/users")
        .then((res) => {
          setRows(res.data.filter((user: User) => user.Status === "Reported"));
          setIsPending(false);
          setError(null);
        })
        .catch((error) => {
          setIsPending(false);
          setError(error.message);
        });
    }, 300);
  }, [openVerify]);

  const handleClickOpenVerify = (id: string) => {
    setOpenVerify(true);
    setId(id);
  };

  const handleCloseVerify = (result: string, id: string) => () => {
    setOpenVerify(false);
    if (result == "Yes") {
      const user: User = rows.find((user) => user.id === id)!;
      user.Status = "Active";
      setTimeout(() => {
        axios
          .put(`http://localhost:8000/users/${user.id}`, user)
          .then(() => {
            setIsPending(false);
            setError(null);
          })
          .catch((error) => {
            setIsPending(false);
            setError(error.message);
          });
      });
    }
  };

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
          rows={rows}
          columns={columns}
          pageSize={12}
          rowsPerPageOptions={[5]}
        />
      </Box>

      <Dialog
        open={openVerify}
        onClose={handleCloseVerify}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Are you sure?"}
          <Typography variant="h6" sx={{ fontSize: 14, fontWeight: 400 }}>
            {"Are you sure that you want to accept this offer " + id + "?"}
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

export default Offers;
