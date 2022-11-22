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
  Link,
  Typography,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { Offer, User, NFT_load } from "../../src/interfaces";
import { useAccount } from "wagmi";
import axios from "axios";
import { useSignTypedData } from "wagmi";
import MarketplaceAddress from "../../contractsData/Marketplace-address.json";
import { ethers, Signature } from "ethers";
import Countdown from "react-countdown";
import { useGetETHExchangeRate } from "../hooks/useHook";
type OffersProps = {
  setOfferPrice: (price: string) => void;
  salesOrder: NFT_load;
  offers: Offer[];
  user_id: string;
  setOfferSignature: (signature: string) => void;
  getSetOffers: () => Promise<void>;
  isPendingPayment: boolean;
  openDecline: boolean;
  setOpenDecline: React.Dispatch<React.SetStateAction<boolean>>;
  openAccept: boolean;
  setOpenAccept: React.Dispatch<React.SetStateAction<boolean>>;
  listingType: string;
};

const Offers: FC<OffersProps> = ({
  offers,
  setOfferPrice,
  user_id,
  setOfferSignature,
  getSetOffers,
  salesOrder,
  isPendingPayment,
  openAccept,
  setOpenAccept,
  openDecline,
  setOpenDecline,
  listingType,
}) => {
  function getFromID(params: GridRenderCellParams) {
    return [`${params.row.fromID}`, `${params.row.from}`];
  }

  function getExpiration(params: GridRenderCellParams) {
    return [`${params.row.expiration}`];
  }

  function getUSDPrice(params: GridRenderCellParams) {
    return `${Number(params.row.price) * ethExRate}`;
  }

  function isRejected(params: GridRenderCellParams) {
    return params.row.state === "REJECTED";
  }

  const ownerColumns = [
    {
      field: "price",
      headerName: "Price (ETH)",
      type: "string",
      width: 150,
    },
    {
      field: "actions3",
      headerName: "Price (USD)",
      //type: "string",
      width: 150,
      renderCell: (params: GridRenderCellParams<String>) => (
        <div>{getUSDPrice(params).substring(0, 10)}</div>
      ),
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
      //type: "string",
      width: 150,
      renderCell: (params: GridRenderCellParams<String>) => (
        <div>
          <Countdown date={Number(getExpiration(params)[0])} />
        </div>
      ),
    },
    {
      field: "actions1",
      headerName: "From",
      //type: "string",
      width: 150,
      renderCell: (params: GridRenderCellParams<String>) => (
        <div>
          {getFromID(params)[0] !== "" ? (
            <Link href={`../../view/user/${getFromID(params)[0]}`}>
              {getFromID(params)[1]}
            </Link>
          ) : (
            <div>{getFromID(params)[1]}</div>
          )}
        </div>
      ),
    },
    {
      field: "actions",
      //type: "actions",
      width: 200,
      headerName: "Review",
      renderCell: (params: GridRenderCellParams<String>) => (
        <div>
          {isPendingPayment === false && isRejected(params) === false ? (
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
                <a>Accept</a>
              </Button>
              <Button
                variant="contained"
                color="primary"
                //key={params.row.id}
                sx={{ backgroundColor: "red", color: "whitesmoke" }}
                onClick={() => handleClickOpenDecline(params.row.id)}
              >
                <a>Decline</a>
              </Button>
            </Box>
          ) : (
            <Box>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "green",
                  color: "whitesmoke",
                  marginInline: "15px",
                }}
                disabled
              >
                <a>Accept</a>
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{ backgroundColor: "red", color: "whitesmoke" }}
                disabled
              >
                <a>Decline</a>
              </Button>
            </Box>
          )}
        </div>
      ),
    },
  ];
  const columns: GridColDef[] = [
    {
      field: "price",
      headerName: "Price (ETH)",
      type: "string",
      width: 200,
    },
    {
      field: "actions3",
      headerName: "Price (USD)",
      //type: "string",
      width: 200,
      renderCell: (params: GridRenderCellParams<String>) => (
        <div>{getUSDPrice(params).substring(0, 10)}</div>
      ),
    },
    {
      field: "state",
      headerName: "Status",
      type: "string",
      width: 150,
    },
    {
      field: "actions2",
      headerName: "Expiration",
      //type: "string",
      width: 200,
      renderCell: (params: GridRenderCellParams<String>) => (
        <div>
          <Countdown date={Number(getExpiration(params)[0])} />
        </div>
      ),
    },
    {
      field: "actions1",
      headerName: "From",
      //type: "string",
      width: 200,
      renderCell: (params: GridRenderCellParams<String>) => (
        <div>
          {getFromID(params)[0] !== "" ? (
            <Link href={`../../view/user/${getFromID(params)[0]}`}>
              {getFromID(params)[1]}
            </Link>
          ) : (
            <div>{getFromID(params)[1]}</div>
          )}
        </div>
      ),
    },
  ];
  const { signTypedDataAsync } = useSignTypedData();
  const types = {
    SignedNFTData: [
      { name: "tokenID", type: "uint256" },
      { name: "price", type: "uint256" },
      { name: "uri", type: "string" },
      { name: "creator", type: "address" },
      { name: "category", type: "string" },
      { name: "collection", type: "address" },
      { name: "royality", type: "uint256" },
    ],
  };
  const domain = {
    name: "Lazy Marketplace",
    version: "1.0",
    chainId: 5, //TODO Rinkeby => 4, Local network=>1337,Goerli=>5
    verifyingContract: MarketplaceAddress.address,
  };
  const [rows, setRows] = useState<Offer[]>([]);
  // const [openAccept, setOpenAccept] = useState(false);
  // const [openDecline, setOpenDecline] = useState(false);
  const [rowId, setRowId] = useState("");
  const [status, setStatus] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const { data: account } = useAccount();
  const { ethExRate } = useGetETHExchangeRate();

  const handleClickOpenAccept = (id: string) => {
    setOpenAccept(true);
    setRowId(id);
  };

  const handleCloseAccept = async (result: string, id: string) => {
    if (result == "Yes") {
      try {
        const offer: Offer = offers.find((offer) => offer.id == id)!;
        const biddingSignature = await signTypedDataAsync({
          domain,
          types,
          value: {
            tokenID: salesOrder.tokenID,
            uri: salesOrder.uri,
            creator: salesOrder.creatorWalletAddress,
            category: salesOrder.category,
            collection: salesOrder.collection,
            royality: salesOrder.royality,
            price: ethers.utils.parseEther(offer.price), //TODO PRICE
          },
        });
        setOfferPrice(offer.price);
        setOfferSignature(biddingSignature);
        await axios.post("/api/acceptOffer", {
          data: {
            id: offer.id,
            biddingSignature: biddingSignature,
          },
        });
        getSetOffers();
        setError(null);
        setOpenAccept(false);
      } catch (error) {
        console.log("Offer Accepting error!");
      }
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
      const offer: Offer = offers.find((offer) => offer.id == id)!;

      await axios
        .post("/api/declineOffer", {
          data: {
            id: offer.id,
          },
        })
        .then(() => {
          setIsPending(false);
          setError(null);
          setOpenDecline(false);
        })
        .catch((error) => {
          setIsPending(false);
          setError(error.message);
        });
    } else {
      setOpenDecline(false);
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
          columns={
            account?.address === user_id && listingType === "FIXED_PRICE"
              ? ownerColumns
              : columns
          }
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
  );
};

export default Offers;
