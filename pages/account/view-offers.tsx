import { NextPage } from "next";
import ModalPopUp from "../../components/Popup/Modal";
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
import { Offer, OfferToAccept } from "../../src/interfaces";
import { useAccount, useConnect, useSigner } from "wagmi";
import axios from "axios";
import { useSignTypedData, useContract } from "wagmi";
import MarketplaceAddress from "../../contractsData/Marketplace-address.json";
import MarketplaceAbi from "../../contractsData/Marketplace.json";
import { ethers } from "ethers";
import { useIsMounted } from "../../components/hooks";
import api from "../../lib/api";
import authService from "../../services/auth.service";
import { useGetMyOffers } from "../../components/hooks/useHook";
import Title from "../../components/ui/Title";
import theme from "../../src/theme";

const BidOffers: NextPage = (props) => {
  const { data: account } = useAccount();
  const isMounted = useIsMounted();
  const { offers, isPendingOffers, errorOffers } = useGetMyOffers();
  const [openAccept, setOpenAccept] = useState(false);
  const [openDecline, setOpenDecline] = useState(false);
  const [rowId, setRowId] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [msg, setMsg] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const { activeConnector } = useConnect();

  function getNFT(params: GridRenderCellParams) {
    return [
      `${params.row.owner}`,
      `${params.row.nftUrl}`,
      `${params.row.nftName}`,
    ];
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
  const { data: signer, isError, isLoading } = useSigner();
  const marketplace_ = useContract({
    //TODO create connection with marketplace
    addressOrName: MarketplaceAddress.address,
    contractInterface: MarketplaceAbi.abi,
    signerOrProvider: signer,
  });
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

  const handleClickOpenAccept = (id: string) => {
    setOpenAccept(true);
    setRowId(id);
  };

  const handleCloseAccept = async (result: string, id: string) => {
    setIsPending(true);
    if (result == "Yes") {
      setOpenAccept(false);

      try {
        const offer: OfferToAccept = offers.find((offer) => offer.id == id)!;
        let token;
        if (activeConnector) {
          token = authService.getUserToken();
        } else {
          throw new Error("User is not exist");
        }
        const biddingSignature = await signTypedDataAsync({
          domain,
          types,
          value: {
            tokenID: offer.tokenID,
            uri: offer.uri,
            creator: offer.creator,
            category: offer.category,
            collection: offer.collection,
            royality: offer.royality,
            price: ethers.utils.parseEther(offer.price), //TODO PRICE
          },
        });

        const tokenID = await marketplace_.mintNFT(
          //TODO add blockchain
          {
            tokenID: offer.tokenID,
            uri: offer.uri,
            creator: offer.creator,
            category: offer.category,
            collection: offer.collection,
            owner: offer.owner,
            royality: offer.royality,
            price: ethers.utils.parseEther(offer.price),
            buyer: account?.address,
            payType: 1,
            saleNum: offer.saleNum,
          },
          biddingSignature,
          {
            value: ethers.utils.parseEther(offer.price),
            gasLimit: 1000000,
          }
        );
        const output = await tokenID.wait();
        const date = new Date();
        const timestampInMs = date.getTime();
        const res1 = await api.post("/api/payBidding", {
          data: {
            id: offer.nftId,
            token: token,
            time: timestampInMs,
            price: offer.price,
          },
        });
        setOpen(true);
        setMsg(res1.status === 201 ? "Successful!" : "Try again later!");
        setError(null);
      } catch (error) {
        console.log("Offer Accepting error!");
      }
    } else {
      setOpenAccept(false);
    }
    setIsPending(false);
  };

  const handleClickOpenDecline = (id: string) => {
    setOpenDecline(true);
    setRowId(id);
  };

  const handleCloseDecline = async (result: string, id: string) => {
    if (result == "Yes") {
      const offer: OfferToAccept = offers.find((offer) => offer.id == id)!;
      const res1 = await axios.post("/api/declineOffer", {
        data: {
          id: offer.id,
        },
      });
      setOpen(true);
      setMsg(res1.status === 201 ? "Successful!" : "Try again later!");
      setError(null);
    } else {
      setOpenDecline(false);
    }
  };

  return isMounted && activeConnector && !isPendingOffers ? (
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
          [theme.breakpoints.down("md")]: {
            minWidth: "90%",
          },
          [theme.breakpoints.up("md")]: {
            width: "75%",
          },

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
      <ModalPopUp msg={msg} open={open} setOpen={setOpen} setMsg={setMsg} />
    </div>
  ) : (
    <Box sx={{ width: "100%" }}>
      <LinearProgress />
    </Box>
  );
};

export default BidOffers;
