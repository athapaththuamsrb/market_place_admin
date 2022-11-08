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
import { FC, useEffect, useState } from "react";
import { Offer, User } from "../../src/interfaces";
import { useAccount } from "wagmi";
import axios from "axios";
import api from "../../lib/api";

type OffersProps = {
  offers: Offer[];
  user_id: string;
  getSetOffers: () => Promise<void>;
};

const Offers: FC<OffersProps> = ({ offers, user_id, getSetOffers }) => {
  const ownerColumns = [
    {
      field: "price",
      headerName: "Price",
      type: "string",
      width: 150,
    },
    {
      field: "state",
      headerName: "Status",
      type: "string",
      width: 150,
    },
    {
      field: "expiration",
      headerName: "Expiration",
      type: "string",
      width: 150,
    },

    {
      field: "floor_diff",
      headerName: "Floor Difference",
      type: "string",
      width: 150,
    },
    {
      field: "from",
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
          variant="contained"
          // color="primary"
          key={params.row.id}
          sx={{ backgroundColor: "green",color:"whitesmoke" }}
          onClick={() => handleClickOpenAccept(params.row.id)}
        >
          <a>Accept</a>
        </Button>,
        <Button
          variant="contained"
          color="primary"
          key={params.row.id}
          sx={{ backgroundColor: "red", color: "whitesmoke" }}
          onClick={() => handleClickOpenDecline(params.row.id)}
        >
          <a>Decline</a>
        </Button>,
      ],
    },
  ];
  const columns = [
    {
      field: "price",
      headerName: "Price",
      type: "string",
      width: 200,
    },
    {
      field: "usd_price",
      headerName: "USD Price",
      type: "string",
      width: 200,
    },
    {
      field: "expiration",
      headerName: "Expiration",
      type: "string",
      width: 200,
    },

    {
      field: "floor_diff",
      headerName: "Floor Difference",
      type: "string",
      width: 200,
    },
    {
      field: "from",
      headerName: "From",
      type: "string",
      width: 200,
    },
  ];

  const [rows, setRows] = useState<Offer[]>([]);
  const [openAccept, setOpenAccept] = useState(false);
  const [openDecline, setOpenDecline] = useState(false);
  const [rowId, setRowId] = useState("");
  const [status, setStatus] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const { data: account } = useAccount();

  useEffect(() => {}, [openAccept, openDecline]);

  const handleClickOpenAccept = (id: string) => {
    setOpenAccept(true);
    setRowId(id);
  };

  const handleCloseAccept = (result: string, id: string) => () => {
    setOpenAccept(false);
    if (result == "Yes") {
      try {
        const offer: Offer = offers.find((offer) => offer.id == id)!;
        axios.post("../../../api/acceptOffer", {
          data: {
            id: offer.id,
          },
        });
        getSetOffers();
        setError(null);
      } catch (error) {
        console.log("Offer Accepting error!");
      }
    }
  };

  const handleClickOpenDecline = (id: string) => {
    setOpenDecline(true);
    setRowId(id);
  };

  const handleCloseDecline = (result: string, id: string) => () => {
    setOpenDecline(false);
    if (result == "Yes") {
      const offer: Offer = offers.find((offer) => offer.id == id)!;
      setTimeout(() => {
        axios
          .post("../../api/declineOffer", {
            data: {
              id: offer.id,
            },
          })
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
          rows={offers}
          columns={account?.address === user_id ? ownerColumns : columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </Box>

      <Dialog
        open={openAccept}
        onClose={handleCloseAccept}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Are you sure?"}
          <Typography variant="h6" sx={{ fontSize: 14, fontWeight: 400 }}>
            {"Are you sure that you want to accept this offer?"}
          </Typography>
        </DialogTitle>
        <DialogActions>
          <Button autoFocus onClick={handleCloseAccept("Yes", rowId)}>
            Yes
          </Button>
          <Button onClick={handleCloseAccept("No", rowId)} autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDecline}
        onClose={handleCloseDecline}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Are you sure?"}
          <Typography variant="h6" sx={{ fontSize: 14, fontWeight: 400 }}>
            {"Are you sure that you want to decline this offer?"}
          </Typography>
        </DialogTitle>
        <DialogActions>
          <Button autoFocus onClick={handleCloseDecline("Yes", rowId)}>
            Yes
          </Button>
          <Button onClick={handleCloseDecline("No", rowId)} autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Offers;
