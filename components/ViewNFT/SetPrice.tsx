import React from "react";
import { FC, useEffect, useState } from "react";
import { Activity, NFT_load } from "../../src/interfaces";
import {
  Typography,
  Button,
  Grid,
  TextField,
  Card,
  CardMedia,
  CardContent,
  LinearProgress,
  Accordion,
  ToggleButton,
  ToggleButtonGroup,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import Title from "../ui/Title";
import { Box } from "@mui/system";
import FurtherDetails from "./FurtherDetails";
import { useSigner, useAccount, useConnect } from "wagmi";
import MarketplaceAddress from "../../contractsData/Marketplace-address.json";
import { ethers } from "ethers";
import api from "../../lib/api";
import { useRouter } from "next/router";
import { useFormik, Field } from "formik";
import * as yup from "yup";
import { useSignTypedData } from "wagmi";
import ModalPopUp from "../Modal";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ItemActivity from "../ui/ItemActivity";
import { useIsMounted } from "../hooks";
import axios from "axios";
import authService from "../../services/auth.service";
import theme from "../../src/theme";

interface ViewNFTProps {
  salesOrder: NFT_load;
}
const SetPrice: FC<ViewNFTProps> = (props) => {
  const {
    activeConnector,
    connect,
    connectors,
    error,
    isConnecting,
    pendingConnector,
  } = useConnect();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [alignment, setAlignment] = useState("FIXED_PRICE");
  const [toggle, setToggle] = useState<string>("FIX");
  const [activity, setActivity] = useState<Activity[]>([]);
  const isMounted = useIsMounted();
  const { data: account } = useAccount();
  const [msg, setMsg] = useState<string>("");
  const [open, setOpen] = useState(false);
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    if (newAlignment === "FIX") setAlignment("FIXED_PRICE");
    else if (newAlignment === "BID") setAlignment("TIMED_AUCTION");
  };

  const formik = useFormik({
    initialValues: {
      price: "",
      expireDate: "",
    },
    validationSchema: yup.object({
      price: yup.string().required("required field"),
      expireDate: yup.string().length(16).required("required field"),
    }),
    onSubmit: async (values: { price: string; expireDate: string }) => {
      try {
        setIsPending(true);
        setMsg("processing.....");
        const date = new Date(values.expireDate);
        //  timestamp in milliseconds(Unix timestamp)
        const timestampInMs = date.getTime();
        const signature = await signTypedDataAsync({
          domain,
          types,
          value: {
            tokenID: props.salesOrder.tokenID,
            uri: props.salesOrder.uri,
            creator: props.salesOrder.creatorWalletAddress,
            category: props.salesOrder.category,
            collection: props.salesOrder.collection,
            royality: props.salesOrder.royality,
            price: ethers.utils.parseEther(values.price), //TODO PRICE
          },
        });
        let token;
        if (activeConnector) {
          token = authService.getUserToken();
        } else {
          throw new Error("User is not exist");
        }
        if (props.salesOrder.id.length === 46) {
          const res1 = await axios.post("/api/addNFTToDB", {
            data: {
              collection: props.salesOrder.collection,
              ownerWalletAddress: props.salesOrder.walletAddress,
              creatorWalletAddress: props.salesOrder.creatorWalletAddress,
              price: values.price,
              tokenID: props.salesOrder.tokenID,
              uri: props.salesOrder.uri,
              endDate: timestampInMs,
              signature: signature,
              saleWay: alignment,
              token: token,
            },
          });
          setMsg(res1.status === 204 ? "Successful!" : "Try again!!");
        } else {
          const res1 = await axios.post("/api/setStateNFT", {
            data: {
              action: "listed",
              value: true,
              id: props.salesOrder.id,
              price: values.price,
              signature: signature,
              saleWay: alignment,
              endDate: timestampInMs,
              token: token,
            },
          });
          setMsg(res1.status === 201 ? "Successful!" : "Try again!!");
        }
        setIsPending(false);
        setOpen(true);
        formik.values.price = "";
      } catch (error) {
        // console.log(error);
        setMsg("Try again!!");
      }
    },
  });

  const getSetActivity = async () => {
    try {
      setIsPending(true);
      const { data } = await api.post("/api/getNFTActivity", {
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

  useEffect(() => {
    getSetActivity();
  }, []);

  const domain = {
    name: "Lazy Marketplace",
    version: "1.0",
    chainId: 5, //TODO Rinkeby => 4, Local network=>1337,Goerli=>5
    verifyingContract: MarketplaceAddress.address,
  };
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
  const { signTypedDataAsync } = useSignTypedData();
  return (
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
            ? "List"
            : "Buy"
        }
        secondWord="NFT"
      />

      <Box sx={{ width: "70%", marginX: "auto", marginBottom: "30px" }}>
        <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid alignSelf={"center"} item xs={12} sm={12} md={5}>
            <Card sx={{ display: "flex", boxShadow: 0 }}>
              <CardMedia
                component="img"
                image={props.salesOrder?.image}
                alt="avatar"
                sx={{
                  height: 400,
                  borderRadius: 2,
                }}
              />
            </Card>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={7}
            sx={{ boxShadow: 0, borderRadius: 2 }}
          >
            <Card
              sx={{
                [theme.breakpoints.up("md")]: {
                  minHeight: 400,
                },
                borderRadius: 2,
              }}
            >
              <CardContent>
                <form onSubmit={formik.handleSubmit}>
                  <ToggleButtonGroup
                    color="secondary"
                    value={toggle}
                    exclusive
                    onChange={handleChange}
                    aria-label="Platform"
                    fullWidth
                    sx={{ marginY: "20px" }}
                  >
                    <ToggleButton
                      value="FIX"
                      onClick={() => {
                        setToggle("FIX");
                      }}
                    >
                      FIX
                    </ToggleButton>
                    <ToggleButton
                      value="BID"
                      onClick={() => {
                        setToggle("BID");
                      }}
                    >
                      BID
                    </ToggleButton>
                  </ToggleButtonGroup>
                  <Typography
                    variant="h2"
                    align="left"
                    sx={{ marginTop: "0px", marginBottom: "5px" }}
                  >
                    {props.salesOrder?.name}
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
                  <Box>
                    <TextField
                      sx={{ marginBottom: "5px" }}
                      id="price"
                      label="Price"
                      variant="outlined"
                      disabled={isPending}
                      fullWidth
                      name="price"
                      value={formik.values.price}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.price && formik.errors.price ? (
                      <Typography sx={{ color: "error.main" }}>
                        {formik.errors.price}
                      </Typography>
                    ) : null}
                  </Box>
                  <Box>
                    <TextField
                      id="expireDate"
                      variant="outlined"
                      fullWidth
                      type="datetime-local"
                      disabled={isPending}
                      value={formik.values.expireDate}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      inputProps={{
                        min: new Date(Date.now() + 24 * 60 * 60 * 1000)
                          .toISOString()
                          .slice(0, 16),
                      }}
                    />
                    {formik.touched.expireDate && formik.errors.expireDate ? (
                      <Typography sx={{ color: "error.main" }}>
                        {formik.errors.expireDate}
                      </Typography>
                    ) : null}
                  </Box>
                  <Box textAlign={"right"}>
                    <Button
                      type="submit"
                      size="small"
                      disabled={isPending}
                      color="secondary"
                      variant="contained"
                      sx={{ marginTop: 2 }}
                    >
                      <Typography
                        color="white"
                        variant="h2"
                        sx={{ fontSize: 20 }}
                      >
                        SELL ORDER
                      </Typography>
                    </Button>
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ width: "70%", marginX: "auto", marginBottom: "50px" }}>
        <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid alignSelf={"center"} item xs={12} sm={12} md={5}>
            <FurtherDetails
              creatorUserID={props.salesOrder?.creatorUserID}
              creatorUserName={props.salesOrder?.creatorUsername}
              tokenID={props.salesOrder?.tokenID}
              collectionID={props.salesOrder?.collectionID}
              collectionName={props.salesOrder?.collectionName}
              uri={props.salesOrder?.uri}
            />
          </Grid>
          <Grid alignSelf={"center"} item xs={12} sm={12} md={7}>
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
      <ModalPopUp msg={msg} open={open} setOpen={setOpen} setMsg={setMsg} />
    </Box>
  );
};

export default SetPrice;
