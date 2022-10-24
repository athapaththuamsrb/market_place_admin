import { FC, useState } from "react";
import { NFT_load } from "../../src/interfaces";
import { Typography, Button, Grid, Avatar, Stack } from "@mui/material";
import Title from "../ui/Title";
import { Box } from "@mui/system";
import FurtherDetails from "./FurtherDetails";
import { useSigner, useContract, useAccount, useConnect } from "wagmi";
import MarketplaceAddress from "../../contractsData/Marketplace-address.json";
import MarketplaceAbi from "../../contractsData/Marketplace.json";
import { ethers } from "ethers";
import api from "../../lib/api";
import LinearProgress from "@mui/material/LinearProgress";
import { useRouter } from "next/router";
import ModalPopUp from "../Modal";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ListingHistoryTable from "../ui/ItemActivity";
import { useIsMounted } from "../hooks";

import OfferPopup from "../OfferPopup";
import ReportPopup from "../ReportPopup";
import React from "react";

interface ViewNFTProps {
  salesOrder: NFT_load;
}

const ViewNFT: FC<ViewNFTProps> = (props) => {
  const { data: signer, isError, isLoading } = useSigner(); //TODO data is useSigner attibute we assign that value to signer
  const marketplace_ = useContract({
    //TODO create connection with marketplace
    addressOrName: MarketplaceAddress.address,
    contractInterface: MarketplaceAbi.abi,
    signerOrProvider: signer,
  });
  const isMounted = useIsMounted();
  const [msg, setMsg] = useState<string>("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [openReportPopup, setOpenReportPopup] = useState(false);
  const { data: account } = useAccount();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open1 = Boolean(anchorEl);
  const {
    activeConnector,
    connect,
    connectors,
    error,
    isConnecting,
    pendingConnector,
  } = useConnect();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const setStateNFT = async (key: string, value: boolean, price: string) => {
    try {
      setIsPending(true);

      switch (key) {
        case "listed":
          await api.post("/api/setStateNFT", {
            data: {
              action: key,
              value,
              id: props.salesOrder.id,
              price: price,
            },
          });
          props.salesOrder.listed = value;
          break;

        case "sold":
          await api.post("/api/setStateNFT", {
            data: { action: key, value, id: props.salesOrder.id, price: price },
          });
          props.salesOrder.sold = value;
          break;

        default:
          console.log("undefined");
      }

      setIsPending(false);
    } catch (error) {
      console.log("update error");
      setIsPending(false);
    }
  };
  const mintAndBuy = async () => {
    //TODO adding data to blockchain
    setIsPending(true);

    // console.log(nftData);
    if (
      props.salesOrder.walletAddress === props.salesOrder.creatorWalletAddress
    ) {
      setMsg("processing.....");
      const tokenID = await marketplace_.lazyMintNFT(
        //TODO add blockchain
        {
          tokenID: props.salesOrder.tokenID,
          uri: props.salesOrder.uri,
          creator: props.salesOrder.creatorWalletAddress,
          category: props.salesOrder.category,
          collection: props.salesOrder.collection,
          royality: props.salesOrder.royality,
          price: ethers.utils.parseEther(props.salesOrder.price),
        },
        props.salesOrder.signature,
        { value: ethers.utils.parseEther(props.salesOrder.price) }
      );
      setMsg("Successful!");
      setOpen(true);
      setStateNFT("sold", true, "0");
    } else {
      const tokenID = await marketplace_.mintNFT(
        //TODO add blockchain
        {
          tokenID: props.salesOrder.tokenID,
          uri: props.salesOrder.uri,
          creator: props.salesOrder.creatorWalletAddress,
          category: props.salesOrder.category,
          collection: props.salesOrder.collection,
          owner: props.salesOrder.walletAddress,
          royality: props.salesOrder.royality,
          price: ethers.utils.parseEther(props.salesOrder.price),
        },
        props.salesOrder.signature,
        { value: ethers.utils.parseEther(props.salesOrder.price) }
      );
      setMsg("Successful!");
      setOpen(true);
      setStateNFT("sold", true, "0");
    }
    setIsPending(false);
  };
  return isMounted ? (
    <Box>
      {isPending && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      )}
      <Title
        firstWord={
          account?.address === props.salesOrder?.walletAddress ||
          !props.salesOrder?.listed
            ? "View"
            : "Buy"
        }
        secondWord="NFT"
      />
      <Box sx={{ width: "70%", marginX: "auto" }}>
        <Grid container>
          <Grid alignSelf={"center"} item xs={6}>
            <Stack alignItems="center">
              <Avatar
                alt="avatar"
                src={props.salesOrder?.image}
                sx={{
                  width: 400,
                  height: 400,
                  boxShadow: 3,
                  borderRadius: 1,
                }}
                variant="square"
              />
            </Stack>
          </Grid>
          <Grid item xs={6} sx={{ boxShadow: 1, borderRadius: 1 }}>
            <Box sx={{ width: "90%", marginX: "auto" }}>
              {/* Report option */}
              {activeConnector &&
                account?.address !== props.salesOrder?.walletAddress && (
                  <Box textAlign={"right"} marginTop={"10px"}>
                    <IconButton id="long-button" onClick={handleClick}>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      id="long-menu"
                      anchorEl={anchorEl}
                      open={open1}
                      onClose={handleClose}
                    >
                      <MenuItem
                        onClick={() => {
                          setOpenReportPopup(true), setAnchorEl(null);
                        }}
                        sx={{ fontWeight: 500, fontSize: 14 }}
                      >
                        Report NFT
                      </MenuItem>
                    </Menu>
                    <ReportPopup
                      openReportPopup={openReportPopup}
                      setOpenReportPopup={setOpenReportPopup}
                    ></ReportPopup>
                  </Box>
                )}

              <Typography
                variant="h2"
                align="left"
                sx={{ marginTop: "10px", marginBottom: "5px" }}
              >
                {props.salesOrder?.name}
              </Typography>

              <Typography
                sx={{ marginBottom: "20px", fontWeight: 400, fontSize: 14 }}
                color="gray"
                align="left"
              >
                {"Contract Address: " + props.salesOrder?.walletAddress}
              </Typography>

              <Typography
                sx={{ marginBottom: "10px" }}
                variant="h4"
                align="left"
              >
                Description :
              </Typography>

              <Typography
                sx={{ marginBottom: "20px", fontWeight: 400, fontSize: 15 }}
                color="gray"
                align="left"
              >
                {props.salesOrder?.description}
              </Typography>

              {/* Price */}
              {props.salesOrder?.price !== "0" && (
                <div>
                  <Typography
                    sx={{ marginBottom: "10px" }}
                    variant="h4"
                    align="left"
                  >
                    Price :
                  </Typography>
                  <Typography
                    sx={{ marginBottom: "20px" }}
                    variant="h3"
                    align="left"
                    color={"primary"}
                  >
                    {`${props.salesOrder?.price} ETH`}
                  </Typography>
                </div>
              )}

              {/* Remove sell */}
              {activeConnector &&
                account?.address === props.salesOrder?.walletAddress &&
                props.salesOrder?.listed && (
                  <Box textAlign={"right"}>
                    <Button
                      onClick={() => {
                        setStateNFT("listed", false, "0");
                        props.salesOrder.price = "0";
                      }}
                      disabled={isPending}
                      size="small"
                      color="secondary"
                      variant="contained"
                    >
                      <Typography
                        color="white"
                        sx={{ fontWeight: 600, fontSize: 20 }}
                      >
                        REMOVE SELL
                      </Typography>
                    </Button>
                  </Box>
                )}

              {/* Sell */}
              {activeConnector &&
                account?.address === props.salesOrder?.walletAddress &&
                !props.salesOrder?.listed && (
                  <Box textAlign={"right"}>
                    <Button
                      onClick={() => {
                        router.push(`${router.asPath}/set-sell-value`);
                      }}
                      size="small"
                      color="secondary"
                      variant="contained"
                    >
                      <Typography
                        color="white"
                        variant="h2"
                        sx={{ fontSize: 20 }}
                      >
                        SELL
                      </Typography>
                    </Button>
                  </Box>
                )}

              {/* Buy , make offer*/}
              {activeConnector &&
                account?.address !== props.salesOrder?.walletAddress &&
                props.salesOrder?.listed && (
                  <Box
                    textAlign={"right"}
                    display="flex"
                    justifyContent="space-evenly"
                  >
                    <Button
                      onClick={mintAndBuy}
                      disabled={isPending}
                      size="small"
                      color="secondary"
                      variant="contained"
                    >
                      <Typography
                        color="white"
                        sx={{ fontWeight: 600, fontSize: 20 }}
                      >
                        BUY NFT
                      </Typography>
                    </Button>

                    <Button
                      onClick={() => setOpenPopup(true)}
                      size="small"
                      color="secondary"
                      variant="contained"
                    >
                      <Typography
                        color="white"
                        sx={{ fontWeight: 600, fontSize: 20 }}
                      >
                        MAKE OFFER
                      </Typography>
                    </Button>

                    <OfferPopup
                      openPopup={openPopup}
                      setOpenPopup={setOpenPopup}
                    ></OfferPopup>
                  </Box>
                )}
            </Box>
          </Grid>
        </Grid>
      </Box>
      <br />
      <Box sx={{ width: "70%", marginX: "auto", marginBottom: "3%" }}>
        <Grid container columnSpacing={2}>
          <Grid alignSelf={"center"} item xs={6}>
            <FurtherDetails
              creator={props.salesOrder?.creatorWalletAddress}
              tokenID={props.salesOrder?.tokenID}
              collection={props.salesOrder?.collection}
              uri={props.salesOrder?.uri}
            />
          </Grid>
          <Grid alignSelf={"center"} item xs={6}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Item Activity</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ListingHistoryTable />
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </Box>
      <ModalPopUp msg={msg} open={open} setOpen={setOpen} setMsg={setMsg} />
    </Box>
  ) : (
    <Box sx={{ width: "100%" }}>
      <LinearProgress />
    </Box>
  );
};

export default ViewNFT;
