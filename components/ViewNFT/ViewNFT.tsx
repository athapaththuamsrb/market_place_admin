import { FC, useEffect, useState } from "react";
import { Activity, NFT_load, Offer } from "../../src/interfaces";
import {
  Typography,
  Button,
  Grid,
  Avatar,
  Stack,
  Chip,
  Tooltip,
} from "@mui/material";
import Countdown from "react-countdown";
import Title from "../ui/Title";
import { Box } from "@mui/system";
import FurtherDetails from "./FurtherDetails";
import { useSigner, useContract, useAccount, useConnect } from "wagmi";
import MarketplaceAddress from "../../contractsData/Marketplace-address.json";
import MarketplaceAbi from "../../contractsData/Marketplace.json";
import { ethers } from "ethers";
import LinearProgress from "@mui/material/LinearProgress";
import { useRouter } from "next/router";
import ModalPopUp from "../Popup/Modal";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { useIsMounted } from "../hooks";
import OfferPopup from "../Popup/OfferPopup";
import ReportPopup from "../Popup/ReportPopup";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import React from "react";
import Offers from "../ui/Offers";
import ItemActivity from "../ui/ItemActivity";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import FlagIcon from "@mui/icons-material/Flag";
import ShareIcon from "@mui/icons-material/Share";
import Link from "@mui/material/Link";
import theme from "../../src/theme";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import CopyToClipboard from "react-copy-to-clipboard";
import authService from "../../services/auth.service";
import axios from "axios";
import { number } from "yup";

interface ViewNFTProps {
  salesOrder: NFT_load;
  saleNum: number;
}

const ViewNFT: FC<ViewNFTProps> = (props) => {
  const { data: signer, isError, isLoading } = useSigner();
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
  const [isPendingPayment, setIsPendingPayment] = useState(false);
  const [PendingPaymentBuyer, setPendingPaymentBuyer] = useState("");
  const [PendingPaymentPrice, setPendingPaymentPrice] = useState("");
  const [PendingPaymentOffer, setPendingPaymentOffer] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [offerSignature, setOfferSignature] = useState(
    props.salesOrder.offerSignature
  );
  const [offerPrice, setOfferPrice] = useState(props.salesOrder.offerPrice);
  const [openReportPopup, setOpenReportPopup] = useState(false);
  const { data: account } = useAccount();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open1 = Boolean(anchorEl);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isURLCopied, setIsURLCopied] = useState(false);
  const [openAccept, setOpenAccept] = useState(false);
  const [openDecline, setOpenDecline] = useState(false);

  const [copyURL, setCopyURL] = useState(
    "https://exclusives-five.vercel.app/view/nft/" + props.salesOrder.id
  );
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

  const setStateNFT = async (
    key: string,
    value: boolean,
    price: string,
    type: string
  ) => {
    try {
      let token;
      if (activeConnector) {
        token = authService.getUserToken();
      } else {
        throw new Error("User is not exist");
      }
      switch (key) {
        case "listed":
          const res = await axios.post("/api/setStateNFT", {
            data: {
              action: key,
              value,
              id: props.salesOrder.id,
              token: token,
            },
          });
          props.salesOrder.listed = value;
          setMsg(res.status === 201 ? "Successful!" : "Try again later!");
          break;

        case "sold":
          const date = new Date();
          const timestampInMs = date.getTime();
          if (type === "FIXED") {
            const res1 = await axios.post("/api/setStateNFT", {
              data: {
                action: key,
                value,
                id: props.salesOrder.id,
                token: token,
                time: timestampInMs,
                price: price,
              },
            });
            setMsg(res1.status === 201 ? "Successful!" : "Try again later!");
          } else {
            const res1 = await axios.post("/api/payBidding", {
              data: {
                id: props.salesOrder.id,
                token: token,
                time: timestampInMs,
                price: price,
              },
            });
            setMsg(res1.status === 201 ? "Successful!" : "Try again later!");
          }
          props.salesOrder.sold = value;
          break;
        default:
      }
      setIsPending(false);
      setOpen(true);
    } catch (error) {
      setIsPending(false);
      setOpen(true);
    }
  };

  const getSetActivity = async () => {
    try {
      setIsPending(true);
      const { data } = await axios.post("/api/getNFTActivity", {
        data: {
          id: props.salesOrder.id,
          creatorUserId: props.salesOrder?.creatorUserID,
        },
      });
      const arr1: Activity[] = data.data.reverse();
      setActivity(arr1);
      setIsPending(false);
    } catch (error) {
      console.log("Item activity error!");
      setIsPending(false);
    }
  };

  const getSetOffers = async () => {
    try {
      setIsPending(true);
      const { data } = await axios.post("/api/getNFTOffers", {
        data: {
          id: props.salesOrder.id,
        },
      });
      if (data.data.length !== 0) {
        const arr2: Offer[] = data.data[0].reverse();
        //if a payment in pending for an offer, set true
        setIsPendingPayment(data.data[1]);
        //if an offer is accepted by the owner
        if (isPendingPayment === true) {
          setPendingPaymentBuyer(data.data[2][0].walletAddress);
          setPendingPaymentPrice(data.data[2][0].price);
          setPendingPaymentOffer(data.data[2][0].id);
        }
        setOffers(arr2);
        setIsPending(false);
      }
    } catch (error) {
      console.log("Offer Loading error!");
      setIsPending(false);
    }
  };

  const declineOffer = async () => {
    try {
      setIsPending(true);
      const res = await axios.post("/api/declineOffer", {
        data: {
          id: PendingPaymentOffer,
        },
      });
      setMsg(res.status === 201 ? "Successful!" : "Try again later!");
      setPendingPaymentOffer("");
      setIsPending(false);
      setOpen(true);
    } catch {
      console.log("Offer Declining error!");
      setIsPending(false);
      setOpen(true);
    }
  };

  const mintAndBuy = async (type: string) => {
    //TODO adding data to blockchain
    await setIsPending(true);
    setMsg("processing.....");
    console.log(isPending);
    const price = type === "FIXED" ? props.salesOrder.price : offerPrice;
    const signature =
      type === "FIXED" ? props.salesOrder.signature : offerSignature;
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
        price: ethers.utils.parseEther(price),
        buyer: account?.address,
        payType: 0,
        saleNum: props.saleNum,
      },
      signature,
      {
        value: ethers.utils.parseEther(price),
        gasLimit: 1000000,
      }
    );
    const output = await tokenID.wait();
    console.log(isPending);
    await setStateNFT("sold", true, price, type);
    setIsPending(false);
  };

  useEffect(() => {
    getSetActivity();
    getSetOffers();
    // copy();
  }, [
    isPendingPayment,
    PendingPaymentBuyer,
    PendingPaymentOffer,
    openPopup,
    openAccept,
    openDecline,
    msg,
  ]);
  return (
    <Box>
      {isPending && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      )}
      {msg === "processing....." && (
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
      <Box sx={{ width: "70%", marginX: "auto", marginBottom: "15px" }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid alignSelf={"center"} item xs={12} sm={12} md={5}>
            <Card sx={{ display: "flex", boxShadow: 0 }}>
              <CardMedia
                component="img"
                // height="400"
                // width="400"
                image={props.salesOrder?.image}
                alt="avatar"
                sx={{
                  height: 400,
                  borderRadius: 2,
                }}
              />
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={7}>
            <Card
              sx={{
                [theme.breakpoints.up("md")]: {
                  minHeight: 400,
                },
                borderRadius: 2,
              }}
            >
              <CardHeader
                action={
                  activeConnector &&
                  account?.address &&
                  account?.address !== props.salesOrder?.walletAddress && (
                    <div>
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
                          <FlagIcon sx={{ marginRight: "5px" }}></FlagIcon>
                          Report NFT
                        </MenuItem>
                      </Menu>

                      <ReportPopup
                        reportedId={[
                          props.salesOrder.id,
                          props.salesOrder.ownerUserID,
                          props.salesOrder.tokenID,
                        ]}
                        reportType={"NFT"}
                        reporterId={account?.address}
                        openReportPopup={openReportPopup}
                        setOpenReportPopup={setOpenReportPopup}
                      ></ReportPopup>
                    </div>
                  )
                }
                title={props.salesOrder?.name}
                subheader={
                  <div>
                    Owned by{" "}
                    <Link
                      href={`../../view/user/${props.salesOrder.ownerUserID}`}
                      color="secondary"
                    >
                      {account?.address === props.salesOrder?.walletAddress
                        ? "me"
                        : props.salesOrder.ownerUsername}
                    </Link>
                  </div>
                }
              />

              <CardContent>
                <Typography variant="h4">Description :</Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontWeight: 600, marginTop: "10px" }}
                >
                  {props.salesOrder?.description}
                </Typography>
              </CardContent>

              {/* Price */}
              {props.salesOrder?.price !== "0" && !isPendingPayment && (
                <CardContent>
                  <Typography variant="h4">
                    {props.salesOrder?.listingtype === "FIXED_PRICE"
                      ? "Current Price :"
                      : "Starting Price :"}
                  </Typography>
                  <Box
                    textAlign={"right"}
                    display="flex"
                    justifyContent="space-evenly"
                    marginBottom={2}
                  >
                    <Chip
                      label={`${props.salesOrder?.price} ETH`}
                      color="default"
                      size="medium"
                      //variant="outlined"
                      sx={{
                        //backgroundColor:"#e7e4e7",
                        //color:"black",
                        fontSize: 20,
                        height: "70px",
                        minWidth: "60%",
                        marginTop: "10px",
                        boxShadow: "2",
                      }}
                    />
                  </Box>

                  <Typography variant="h4">Sale ends in :</Typography>
                  <Box
                    textAlign={"right"}
                    display="flex"
                    justifyContent="space-evenly"
                  >
                    <Chip
                      label={
                        <Countdown
                          date={Number(props.salesOrder?.endDate)}
                          //renderer={renderer}
                        />
                      }
                      //color="primary"
                      size="medium"
                      variant="outlined"
                      sx={{
                        fontWeight: "400",
                        fontSize: 20,
                        height: "70px",
                        minWidth: "50%",
                        marginTop: "10px",
                        boxShadow: "0",
                      }}
                    />
                  </Box>
                </CardContent>
              )}

              {/* Remove sell */}
              {activeConnector &&
                account?.address === props.salesOrder?.walletAddress &&
                !PendingPaymentBuyer &&
                props.salesOrder?.listed && (
                  <CardActions
                    sx={{ display: "flex", justifyContent: "space-evenly" }}
                  >
                    <Button
                      onClick={() => {
                        setStateNFT("listed", false, "0", "");
                        props.salesOrder.price = "0";
                      }}
                      disabled={msg === "processing....."}
                      size="small"
                      color="secondary"
                      variant="contained"
                      sx={{ minWidth: "40%", height: "50px", borderRadius: 3 }}
                    >
                      <RemoveShoppingCartIcon
                        sx={{ color: "white", marginX: "5px" }}
                      ></RemoveShoppingCartIcon>
                      <Typography
                        color="white"
                        sx={{
                          fontWeight: 600,
                          fontSize: 20,
                        }}
                      >
                        REMOVE SELL
                      </Typography>
                    </Button>
                  </CardActions>
                )}

              {/* Sell */}
              {activeConnector &&
                account?.address === props.salesOrder?.walletAddress &&
                !props.salesOrder?.listed && (
                  <CardActions
                    sx={{ display: "flex", justifyContent: "space-evenly" }}
                  >
                    <Button
                      onClick={() => {
                        router.push(`${router.asPath}/set-sell-value`);
                      }}
                      size="small"
                      color="secondary"
                      variant="contained"
                      sx={{ minWidth: "40%", height: "50px", borderRadius: 3 }}
                    >
                      <LocalOfferIcon
                        sx={{ color: "white", marginX: "5px" }}
                      ></LocalOfferIcon>
                      <Typography
                        color="white"
                        variant="h2"
                        sx={{ fontSize: 20 }}
                      >
                        SELL
                      </Typography>
                    </Button>
                  </CardActions>
                )}

              {/* Buy , make offer, bid*/}
              {activeConnector &&
                account?.address !== props.salesOrder?.walletAddress &&
                !PendingPaymentBuyer &&
                props.salesOrder?.listed &&
                isPendingPayment === false && (
                  <CardContent>
                    <Box
                      textAlign={"center"}
                      display="flex"
                      justifyContent="space-evenly"
                    >
                      <Grid
                        container
                        rowSpacing={2}
                        columnSpacing={{ xs: 1, sm: 1, md: 1 }}
                        sx={{ maxWidth: "80%" }}
                      >
                        <Grid alignSelf={"center"} item xs={12} sm={12} md={12}>
                          {props.salesOrder?.listingtype === "FIXED_PRICE" && (
                            <Button
                              onClick={() => {
                                mintAndBuy("FIXED");
                              }}
                              disabled={msg === "processing....."}
                              size="small"
                              color="secondary"
                              variant="contained"
                              sx={{
                                minWidth: "40%",
                                height: "50px",
                                borderRadius: 3,
                              }}
                            >
                              <ShoppingCartIcon
                                sx={{ color: "white", marginX: "5px" }}
                              ></ShoppingCartIcon>
                              <Typography
                                color="white"
                                sx={{
                                  [theme.breakpoints.up("xs")]: {
                                    fontWeight: 600,
                                    fontSize: 20,
                                  },
                                }}
                              >
                                BUY NFT
                              </Typography>
                            </Button>
                          )}
                        </Grid>
                        <Grid alignSelf={"center"} item xs={12} sm={12} md={12}>
                          {(props.salesOrder?.listingtype === "FIXED_PRICE" ||
                            props.salesOrder?.listingtype ===
                              "TIMED_AUCTION") && (
                            <Button
                              onClick={() => setOpenPopup(true)}
                              size="small"
                              disabled={msg === "processing....."}
                              color="secondary"
                              variant="contained"
                              sx={{
                                minWidth: "40%",
                                height: "50px",
                                borderRadius: 3,
                              }}
                            >
                              <LocalOfferIcon
                                sx={{ color: "white", marginX: "5px" }}
                              ></LocalOfferIcon>
                              <Typography
                                color="white"
                                sx={{
                                  [theme.breakpoints.up("xs")]: {
                                    fontWeight: 600,
                                    fontSize: 20,
                                  },
                                }}
                              >
                                {props.salesOrder?.listingtype === "FIXED_PRICE"
                                  ? "MAKE OFFER"
                                  : "BID"}
                              </Typography>
                            </Button>
                          )}
                        </Grid>
                      </Grid>
                      {(props.salesOrder?.listingtype === "FIXED_PRICE" ||
                        props.salesOrder?.listingtype === "TIMED_AUCTION") && (
                        <OfferPopup
                          openPopup={openPopup}
                          setOpenPopup={setOpenPopup}
                          nftId={props.salesOrder.id}
                          activity={props.salesOrder.listingtype}
                          endDate={props.salesOrder.endDate}
                        />
                      )}
                    </Box>
                  </CardContent>
                )}

              {activeConnector &&
                PendingPaymentBuyer === account?.address &&
                account?.address !== props.salesOrder?.walletAddress &&
                props.salesOrder?.listed && (
                  <CardContent>
                    {props.salesOrder?.listingtype === "FIXED_PRICE" && (
                      <Box
                        textAlign={"center"}
                        display="flex"
                        justifyContent="space-evenly"
                      >
                        <Grid
                          container
                          rowSpacing={3}
                          columnSpacing={{ xs: 1, sm: 1, md: 1 }}
                          sx={{ maxWidth: "80%" }}
                        >
                          <Grid
                            alignSelf={"center"}
                            item
                            xs={12}
                            sm={12}
                            md={6}
                          >
                            {/* TODO HAVE TO CHAGE */}
                            <Button
                              disabled={msg === "processing....."}
                              onClick={() => {
                                mintAndBuy("OFFER");
                              }}
                              size="small"
                              variant="contained"
                              color="secondary"
                              sx={{
                                minWidth: "40%",
                                height: "50px",
                                borderRadius: 3,
                                //backgroundColor: "#a080e1",
                              }}
                            >
                              <ThumbUpAltIcon
                                sx={{ color: "white", marginX: "5px" }}
                              ></ThumbUpAltIcon>
                              <Typography
                                color="white"
                                sx={{
                                  [theme.breakpoints.up("xs")]: {
                                    fontWeight: 600,
                                    fontSize: 20,
                                  },
                                }}
                              >
                                Confirm Offer
                              </Typography>
                            </Button>
                          </Grid>
                          <Grid
                            alignSelf={"center"}
                            item
                            xs={12}
                            sm={12}
                            md={6}
                          >
                            <Button
                              disabled={msg === "processing....."}
                              size="small"
                              onClick={() => {
                                declineOffer();
                              }}
                              variant="contained"
                              sx={{
                                minWidth: "40%",
                                height: "50px",
                                borderRadius: 3,
                                backgroundColor: "#b7c2c6",
                              }}
                            >
                              <ThumbDownIcon
                                sx={{ color: "white", marginX: "5px" }}
                              ></ThumbDownIcon>
                              <Typography
                                color="white"
                                sx={{
                                  [theme.breakpoints.up("xs")]: {
                                    fontWeight: 600,
                                    fontSize: 20,
                                  },
                                }}
                              >
                                Decline Offer
                              </Typography>
                            </Button>
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                  </CardContent>
                )}
              <CardActions disableSpacing>
                <CopyToClipboard
                  text={copyURL}
                  onCopy={() => setIsURLCopied(true)}
                >
                  <Tooltip title="Copy URL" placement="right" arrow>
                    <IconButton aria-label="share" sx={{ color: "black" }}>
                      <ShareIcon />
                    </IconButton>
                  </Tooltip>
                </CopyToClipboard>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ width: "70%", marginX: "auto", marginBottom: "15px" }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid alignSelf={"left"} item xs={12} sm={12} md={5}>
            <FurtherDetails
              creatorUserID={props.salesOrder?.creatorUserID}
              creatorUserName={props.salesOrder?.creatorUsername}
              tokenID={props.salesOrder?.tokenID}
              collectionID={props.salesOrder?.collectionID}
              collectionName={props.salesOrder?.collectionName}
              uri={props.salesOrder?.uri}
            />
          </Grid>
          <Grid alignSelf={"left"} item xs={12} sm={12} md={7}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <FormatListBulletedIcon
                  sx={{
                    marginRight: "10px",
                  }}
                ></FormatListBulletedIcon>
                <Typography>Item Activity</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ItemActivity activity={activity} />
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ width: "70%", marginX: "auto", marginBottom: "50px" }}>
        <Grid container columnSpacing={2}>
          <Grid alignSelf={"center"} item xs={12}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <LocalOfferIcon
                  sx={{
                    marginRight: "10px",
                  }}
                ></LocalOfferIcon>
                <Typography>Offers</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {/* <ListingHistoryTable activity={activity} /> */}
                <Offers
                  setOfferPrice={setOfferPrice}
                  setOfferSignature={setOfferSignature}
                  salesOrder={props.salesOrder}
                  listingType={props.salesOrder?.listingtype}
                  offers={offers}
                  user_id={props.salesOrder.walletAddress}
                  getSetOffers={getSetOffers}
                  isPendingPayment={isPendingPayment}
                  openAccept={openAccept}
                  setOpenAccept={setOpenAccept}
                  openDecline={openDecline}
                  setOpenDecline={setOpenDecline}
                />
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </Box>
      <ModalPopUp msg={msg} open={open} setOpen={setOpen} setMsg={setMsg} />
    </Box>
  );
};

export default ViewNFT;
