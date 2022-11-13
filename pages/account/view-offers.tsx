import { NextPage } from "next";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
} from "@mui/x-data-grid";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  LinearProgress,
  Link,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { OfferToAccept } from "../../src/interfaces";
import { useAccount, useConnect } from "wagmi";
import axios from "axios";
import { useSignTypedData } from "wagmi";
import MarketplaceAddress from "../../contractsData/Marketplace-address.json";
import { ethers } from "ethers";
import { useIsMounted } from "../../components/hooks";
import api from "../../lib/api";
import authService from "../../services/auth.service";
import { useGetMyOffers } from "../../components/hooks/useHook";
import Title from "../../components/ui/Title";

const BidOffers: NextPage = (props) => {
  const { data: account } = useAccount();
  const isMounted = useIsMounted();
  const { offers, isPendingOffers, errorOffers } = useGetMyOffers();
  const [openAccept, setOpenAccept] = useState(false);
  const [openDecline, setOpenDecline] = useState(false);
  const [rowId, setRowId] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const { activeConnector } = useConnect();

  function getNFT(params: GridRenderCellParams) {
    return [ `${params.row.owner}`,`${params.row.nftUrl}`,`${params.row.nftName}`];
  }

  function isRejected(params: GridRenderCellParams) {
    return params.row.state === "REJECTED";
  }

  const columns = [
    {
      field: "actions1",
      headerName: "NFT",
      //type: "string",
      width: 150,
      renderCell: (params: GridRenderCellParams<String>) => (
        <div>
          <Link href={`../view/nft/${getNFT(params)[0]}/${getNFT(params)[1]}`}>
            {getNFT(params)[2]}
          </Link>
        </div>
      ),
    },
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
      width: 200,
    },
    {
      field: "actions",
      //type: "actions",
      width: 400,
      headerName: "Action",
      renderCell: (params: GridRenderCellParams<String>) => (
        <Box>
          <Button
            variant="contained"
            // color="primary"
            key={params.row.id}
            sx={{
              backgroundColor: "green",
              color: "whitesmoke",
              marginInline: "15px",
            }}
            onClick={() => handleClickOpenAccept(params.row.id)}
          >
            <a>Accept Transaction</a>
          </Button>
          <Button
            variant="contained"
            color="primary"
            //key={params.row.id}
            sx={{ backgroundColor: "red", color: "whitesmoke" }}
            onClick={() => handleClickOpenDecline(params.row.id)}
          >
            <a>Decline Transaction</a>
          </Button>
        </Box>
      ),
    },
  ];
  // const { signTypedDataAsync } = useSignTypedData();
  // const types = {
  //   SignedNFTData: [
  //     { name: "tokenID", type: "uint256" },
  //     { name: "price", type: "uint256" },
  //     { name: "uri", type: "string" },
  //     { name: "creator", type: "address" },
  //     { name: "category", type: "string" },
  //     { name: "collection", type: "address" },
  //     { name: "royality", type: "uint256" },
  //   ],
  // };
  // const domain = {
  //   name: "Lazy Marketplace",
  //   version: "1.0",
  //   chainId: 5, //TODO Rinkeby => 4, Local network=>1337,Goerli=>5
  //   verifyingContract: MarketplaceAddress.address,
  // };

  const handleClickOpenAccept = (id: string) => {
    setOpenAccept(true);
    setRowId(id);
  };

  const handleCloseAccept = async (result: string, id: string) => {
    if (result == "Yes") {
      // try {
      //   const offer: Offer = offers.find((offer) => offer.id == id)!;
      //   const biddingSignature = await signTypedDataAsync({
      //     domain,
      //     types,
      //     value: {
      //       tokenID: salesOrder.tokenID,
      //       uri: salesOrder.uri,
      //       creator: salesOrder.creatorWalletAddress,
      //       category: salesOrder.category,
      //       collection: salesOrder.collection,
      //       royality: salesOrder.royality,
      //       price: ethers.utils.parseEther(offer.price), //TODO PRICE
      //     },
      //   });
      //   await axios.post("/api/acceptOffer", {
      //     data: {
      //       id: offer.id,
      //       biddingSignature: biddingSignature,
      //     },
      //   });
      //   getSetOffers();
      //   setError(null);
      //   setOpenAccept(false);
      // } catch (error) {
      //   console.log("Offer Accepting error!");
      // }
    } else {
      setOpenAccept(false);
    }
  };

  const handleClickOpenDecline = (id: string) => {
    setOpenDecline(true);
    setRowId(id);
  };

  const handleCloseDecline = async (result: string, id: string) => {
    if (result == "Yes") {
      // const offer: OfferToAccept = offers.find((offer) => offer.id == id)!;

      // await axios
      //   .post("/api/declineOffer", {
      //     data: {
      //       id: offer.id,
      //     },
      //   })
      //   .then(() => {
      //     setIsPending(false);
      //     setError(null);
      //     setOpenDecline(false);
      //   })
      //   .catch((error) => {
      //     setIsPending(false);
      //     setError(error.message);
      //   });
    } else {
      setOpenDecline(false);
    }
  };

  return isMounted && activeConnector ? (
    <div>
      {isPending && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      )}
      <Title firstWord="My" secondWord="Offers" />
      <Box
        sx={{
          flexGrow: 1,
          width: "75%",
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
            borderRadius: "10px",
          }}
          rows={offers}
          columns={columns}
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
          <Typography sx={{ fontSize: 14, fontWeight: 400 }}>
            {"Are you sure that you want to accept this offer?"}
          </Typography>
        </DialogTitle>
        <DialogActions>
          <Button autoFocus onClick={() => handleCloseAccept("Yes", rowId)}>
            Yes
          </Button>
          <Button onClick={() => handleCloseAccept("No", rowId)}>No</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDecline}
        onClose={handleCloseDecline}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Are you sure?"}
          <Typography sx={{ fontSize: 14, fontWeight: 400 }}>
            {"Are you sure that you want to decline this offer?"}
          </Typography>
        </DialogTitle>
        <DialogActions>
          <Button autoFocus onClick={() => handleCloseDecline("Yes", rowId)}>
            Yes
          </Button>
          <Button onClick={() => handleCloseDecline("No", rowId)}>No</Button>
        </DialogActions>
      </Dialog>
    </div>
  ) : (
    <Box sx={{ width: "100%" }}>
      <LinearProgress />
    </Box>
  );
};

export default BidOffers;