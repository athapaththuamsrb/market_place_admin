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

import ListingHistoryTable from "../ui/ItemActivity";
import { useIsMounted } from "../hooks";

import OfferPopup from "../OfferPopup";
import ReportPopup from "../ReportPopup";

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
  const [isPending, setIsPendging] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [openReportPopup, setOpenReportPopup] = useState(false);
  const { data: account } = useAccount();
  const {
    activeConnector,
    connect,
    connectors,
    error,
    isConnecting,
    pendingConnector,
  } = useConnect();
  const setStateNFT = async (key: string, value: boolean, price: string) => {
    try {
      setIsPendging(true);
      switch (key) {
        case "listed":
          await api.post("/api/setStateNFT", {
            data: {
              filed: key,
              value,
              id: props.salesOrder.id,
              price: price,
            },
          });
          props.salesOrder.listed = value;
          break;
        case "sold":
          await api.post("/api/setStateNFT", {
            data: { filed: key, value, id: props.salesOrder.id, price: price },
          });
          props.salesOrder.sold = value;
          break;
        default:
          console.log("undefine");
      }
      setIsPendging(false);
    } catch (error) {
      console.log("update error");
      setIsPendging(false);
    }
  };
  const mintAndBuy = async () => {
    //TODO adding data to blockchain
    setIsPendging(true);

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
      setMsg("successfull!!");
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
      setMsg("successfull!!");
      setOpen(true);
      setStateNFT("sold", true, "0");
    }
    setIsPendging(false);
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
                alt="Remy Sharp"
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
              <Box textAlign={"right"} marginTop={"10px"}>
                <Button
                  onClick={() => setOpenReportPopup(true)}
                  size="small"
                  color="secondary"
                  variant="contained"
                >
                  <Typography
                    color="white"
                    sx={{ fontWeight: 600, fontSize: 20 }}
                  >
                    Report NFT
                  </Typography>
                </Button>
              </Box>
              <ReportPopup
                openReportPopup={openReportPopup}
                setOpenReportPopup={setOpenReportPopup}
              ></ReportPopup>
              <Typography
                variant="h2"
                align="left"
                sx={{ marginTop: "30px", marginBottom: "5px" }}
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
                Description:
              </Typography>
              <Typography
                sx={{ marginBottom: "20px", fontWeight: 400, fontSize: 15 }}
                color="gray"
                align="left"
              >
                {props.salesOrder?.description}
              </Typography>
              {props.salesOrder?.price !== "0" && (
                <div>
                  <Typography
                    sx={{ marginBottom: "20px" }}
                    variant="h4"
                    align="left"
                  >
                    Price
                  </Typography>
                  <Typography
                    sx={{ marginBottom: "20px" }}
                    variant="h3"
                    align="left"
                    color={"secondary"}
                  >
                    {`${props.salesOrder?.price} ETH`}
                  </Typography>
                </div>
              )}
              {activeConnector &&
                account?.address === props.salesOrder?.walletAddress &&
                props.salesOrder?.listed && (
                  <Box textAlign={"right"}>
                    <Button
                      onClick={() => {
                        setStateNFT("listed", false, "0");
                        props.salesOrder.price = "0";
                      }}
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
                      //onClick={() => setOpenPopup(true)}
                      onClick={() => setOpenPopup(true)}
                      size="small"
                      color="secondary"
                      variant="contained"
                    >
                      <Typography
                        color="white"
                        sx={{ fontWeight: 600, fontSize: 20 }}
                      >
                        Make Offer
                      </Typography>
                    </Button>
                  </Box>
                )}
              <OfferPopup
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
              ></OfferPopup>
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
