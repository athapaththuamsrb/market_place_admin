import { FC, useState } from "react";
import { NFT_load } from "../../src/interfaces";
import {
  Typography,
  Button,
  Grid,
  TextField,
  Avatar,
  Stack,
} from "@mui/material";
import Title from "../ui/Title";
import { Box } from "@mui/system";
import FurtherDetails from "./FurtherDetails";
import { useSigner, useAccount } from "wagmi";
import MarketplaceAddress from "../../contractsData/Marketplace-address.json";
import { ethers } from "ethers";
import api from "../../lib/api";
import LinearProgress from "@mui/material/LinearProgress";
import { useRouter } from "next/router";
import { useFormik, Field } from "formik";
import * as yup from "yup";
import { useSignTypedData } from "wagmi";
import ModalPopUp from "../Modal";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ListingHistoryTable from "../ui/ItemActivity";
import { useIsMounted } from "../hooks";

interface ViewNFTProps {
  salesOrder: NFT_load;
}
const SetPrice: FC<ViewNFTProps> = (props) => {
  console.log(props.salesOrder);
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const { data: account } = useAccount();
  const [alignment, setAlignment] = useState("FIXED_PRICE");
  const [toggle, setToggle] = useState<string>("FIX");
  const isMounted = useIsMounted();
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    if (newAlignment === "FIX") setAlignment("FIXED_PRICE");
    else if (newAlignment === "BID") setAlignment("TIMED_AUCTION");
  };
  const [msg, setMsg] = useState<string>("");
  const [open, setOpen] = useState(false);

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
        if (props.salesOrder.id.length === 46) {
          const res1 = await api.post("/api/addNFTToDB", {
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
            },
          });
          setMsg(res1.status === 204 ? "Successful!" : "Try again!!");
        } else {
          const res1 = await api.post("/api/setStateNFT", {
            data: {
              action: "listed",
              value: true,
              id: props.salesOrder.id,
              price: values.price,
              signature: signature,
              saleWay: alignment,
              endDate: timestampInMs,
            },
          });
          setMsg(res1.status === 201 ? "Successful!" : "Try again!!");
        }
        setIsPending(false);
        setOpen(true);
        formik.values.price = "";
        router.push("/explore-collections");
      } catch (error) {
        console.log(error);
        setMsg("Try again!!");
      }
    },
  });
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
                    key={"price"}
                    sx={{ marginBottom: "5px" }}
                    autoFocus
                    id="price"
                    label="Price"
                    variant="outlined"
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
                    key={"expireDate"}
                    id="expireDate"
                    variant="outlined"
                    fullWidth
                    type="datetime-local"
                    value={formik.values.expireDate}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    inputProps={{
                      min: new Date(Date.now() + 24 * 60 * 60 * 1000)
                        .toISOString()
                        .slice(0, 16),
                    }}
                    // error={ExpirationError}
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
  );
};

export default SetPrice;
