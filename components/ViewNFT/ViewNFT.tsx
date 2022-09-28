import { FC, useState } from "react";
import { NFT_load } from "../../src/interfaces";
import { Typography, Button, Grid, Avatar, Stack } from "@mui/material";
import Title from "../ui/Title";
import { Box } from "@mui/system";
import FurtherDetails from "./FurtherDetails";
import { useSigner, useContract, useAccount } from "wagmi";
import MarketplaceAddress from "../../contractsData/Marketplace-address.json";
import MarketplaceAbi from "../../contractsData/Marketplace.json";
import { ethers } from "ethers";
import api from "../../lib/api";
import LinearProgress from "@mui/material/LinearProgress";
import { useRouter } from "next/router";
import ModalPopUp from "../Modal";
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
  const [msg, setMsg] = useState<string>("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [isPending, setIsPendging] = useState(false);
  const { data: account } = useAccount();
  console.log(router.pathname);
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
  return (
    <Box>
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
      <Box sx={{ width: "70%", marginX: "auto" }}>
        <Grid container spacing={2}>
          <Grid alignSelf={"center"} item xs={6}>
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
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ width: "90%", marginX: "auto" }}>
              <Typography variant="h2" align="center">
                {props.salesOrder?.name}
              </Typography>
              <Typography
                sx={{ marginBottom: "20px" }}
                color="secondary"
                variant="h3"
                align="center"
              >
                {props.salesOrder?.walletAddress}
              </Typography>
              <Typography
                sx={{ marginBottom: "20px" }}
                variant="h2"
                align="center"
              >
                Description
              </Typography>
              <Typography
                sx={{ marginBottom: "20px" }}
                variant="h4"
                align="center"
              >
                {props.salesOrder?.description}
              </Typography>
              {props.salesOrder?.price !== "0" && (
                <div>
                  <Typography
                    sx={{ marginBottom: "20px" }}
                    variant="h2"
                    align="center"
                  >
                    Price
                  </Typography>
                  <Typography
                    sx={{ marginBottom: "20px" }}
                    variant="h3"
                    align="center"
                    color={"secondary"}
                  >
                    {`${props.salesOrder?.price} ETH`}
                  </Typography>
                </div>
              )}
              {account?.address === props.salesOrder?.walletAddress &&
                props.salesOrder?.listed && (
                  <Box textAlign={"center"}>
                    <Button
                      onClick={() => {
                        setStateNFT("listed", false, "0");
                        props.salesOrder.price = "0";
                      }}
                      size="medium"
                      color="secondary"
                      variant="contained"
                    >
                      <Typography color="white" variant="h2">
                        REMOVE SELL
                      </Typography>
                    </Button>
                  </Box>
                )}
              {account?.address === props.salesOrder?.walletAddress &&
                !props.salesOrder?.listed && (
                  <Box textAlign={"center"}>
                    <Button
                      onClick={() => {
                        router.push(`${router.asPath}/set-sell-value`);
                      }}
                      size="medium"
                      color="secondary"
                      variant="contained"
                    >
                      <Typography color="white" variant="h2">
                        SELL
                      </Typography>
                    </Button>
                  </Box>
                )}
              {account?.address !== props.salesOrder?.walletAddress &&
                props.salesOrder?.listed && (
                  <Box textAlign={"center"}>
                    <Button
                      onClick={mintAndBuy}
                      size="medium"
                      color="secondary"
                      variant="contained"
                    >
                      <Typography color="white" variant="h2">
                        BUY
                      </Typography>
                    </Button>
                  </Box>
                )}
            </Box>
          </Grid>
        </Grid>
      </Box>
      <br />
      <FurtherDetails
        creator={props.salesOrder?.creatorWalletAddress}
        tokenID={props.salesOrder?.tokenID}
        collection={props.salesOrder?.collection}
        uri={props.salesOrder?.uri}
      />
      <ModalPopUp msg={msg} open={open} setOpen={setOpen} setMsg={setMsg} />
    </Box>
  );
};

export default ViewNFT;
