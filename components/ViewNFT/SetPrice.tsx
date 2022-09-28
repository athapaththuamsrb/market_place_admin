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
import * as yup from "Yup";
import { useSignTypedData } from "wagmi";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import ModalPopUp from "../Modal";
interface ViewNFTProps {
  salesOrder: NFT_load;
}
const SetPrice: FC<ViewNFTProps> = (props) => {
  const router = useRouter();
  const [isPending, setIsPendging] = useState(false);
  const { data: account } = useAccount();
  const [royality, setRoyality] = useState(
    props.salesOrder.creatorWalletAddress !== props.salesOrder.walletAddress
      ? props.salesOrder.royality
      : 0
  );
  const [isRoyality, setIsRoyality] = useState(false);
  const [msg, setMsg] = useState<string>("");
  const [open, setOpen] = useState(false);
  console.log("royality", props.salesOrder.royality);
  // console.log(
  //   "xxx",
  //   props.salesOrder.creatorWalletAddress !== props.salesOrder.walletAddress
  // );
  const formik = useFormik({
    initialValues: {
      price: "",
      royality: royality,
    },
    validationSchema: yup.object({
      price: yup.string().required("required field"),
      royality: yup
        .number()
        .required("required field")
        .positive()
        .integer()
        .max(100, "maximum value is 100%")
        .min(0, "maximum value is 0%"),
    }),
    onSubmit: async (values: { price: string; royality: number }) => {
      console.log("came-up", royality);
      try {
        const signature = await signTypedDataAsync({
          domain,
          types,
          value: {
            tokenID: props.salesOrder.tokenID,
            uri: props.salesOrder.uri,
            creator: props.salesOrder.creatorWalletAddress,
            category: props.salesOrder.category,
            collection: props.salesOrder.collection,
            royality: values.royality,
            price: ethers.utils.parseEther(values.price), //TODO PRICE
          },
        });
        console.log("came-down");

        setIsPendging(true);
        setMsg("processing.....");
        console.log("came-1");
        if (props.salesOrder.id.length === 46) {
          console.log("came-2");
          const res1 = await api.post("/api/addNFTToDB", {
            data: {
              category: props.salesOrder.category,
              collection: props.salesOrder.collection,
              creatorWalletAddress: props.salesOrder.creatorWalletAddress,
              ownerWalletAddress: props.salesOrder.walletAddress, //TODO?
              price: formik.values.price,
              tokenID: props.salesOrder.tokenID, //TODO??
              uri: props.salesOrder.uri,
              signature: signature,
              description: props.salesOrder.description,
              image: props.salesOrder.image,
              name: props.salesOrder.name,
              royality: values.royality,
            },
          });
          setMsg(res1.status === 201 ? "successfull!!" : "Try again!!");
        } else {
          console.log("values.royality", values.royality);
          const res1 = await api.post("/api/setStateNFT", {
            data: {
              filed: "listed",
              value: true,
              id: props.salesOrder.id,
              price: values.price,
              signature: signature,
              royality: values.royality,
            },
          });
          setMsg(res1.status === 201 ? "successfull!!" : "Try again!!");
        }
        setIsPendging(false);
        setOpen(true);
        formik.values.price = "";
        formik.values.royality = 0;
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
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsRoyality(event.target.checked);
  };
  return (
    <div>
      <Title
        firstWord={
          account?.address === props.salesOrder?.walletAddress ||
          !props.salesOrder?.listed
            ? "View"
            : "Buy"
        }
        secondWord="NFT"
      />
      {isPending && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      )}
      <br />
      <br />
      <Box sx={{ width: "70%", marginX: "auto" }}>
        <Grid container spacing={12}>
          <Grid alignSelf={"center"} item xs={8}>
            <Stack alignItems="center">
              <Avatar
                alt="Remy Sharp"
                src={props.salesOrder?.image}
                sx={{
                  width: 400,
                  height: 400,
                  boxShadow: 3,
                }}
                variant="square"
              />
            </Stack>
            <br />
            <br />
            <FurtherDetails
              creator={props.salesOrder?.creatorWalletAddress}
              tokenID={props.salesOrder?.tokenID}
              collection={props.salesOrder?.collection}
              uri={props.salesOrder?.uri}
            />
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ width: "90%", marginX: "auto" }}>
              <form onSubmit={formik.handleSubmit}>
                <TextField
                  sx={{ marginBottom: "30px" }}
                  id="price"
                  label="Price"
                  variant="outlined"
                  fullWidth
                  name="price"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                />
                {formik.touched.price && formik.errors.price ? (
                  <Typography sx={{ color: "error.main" }}>
                    {formik.errors.price}
                  </Typography>
                ) : null}
                {props.salesOrder.creatorWalletAddress ===
                  props.salesOrder.walletAddress && (
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isRoyality}
                          onChange={handleChange}
                        />
                      }
                      label="Do you need to get royality fee?"
                    />
                  </FormGroup>
                )}
                {props.salesOrder.creatorWalletAddress ===
                  props.salesOrder.walletAddress &&
                  isRoyality && (
                    <TextField
                      sx={{ marginBottom: "30px" }}
                      id="royality"
                      label="royality"
                      variant="outlined"
                      fullWidth
                      name="royality"
                      value={formik.values.royality}
                      onChange={formik.handleChange}
                    />
                  )}
                <Box textAlign={"center"}>
                  <Button
                    type="submit"
                    size="small"
                    color="secondary"
                    variant="contained"
                  >
                    <Typography color="white" variant="h2">
                      SELL ORDER
                    </Typography>
                  </Button>
                </Box>
              </form>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <ModalPopUp msg={msg} open={open} setOpen={setOpen} setMsg={setMsg} />
    </div>
  );
};

export default SetPrice;
