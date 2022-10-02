import type { NextPage } from "next";
import {
  Grid,
  Typography,
  Box,
  Container,
  Button,
  Avatar,
  Stack,
  ImageListItem,
} from "@mui/material";
import NFTcard from "../../components/ui/NFT";
import { useAccount, useConnect, useBalance } from "wagmi";
import {
  useGetMyNFT,
  useIsMounted,
  useGetMyProfile,
} from "../../components/hooks";
import Connect from "../../components/Login/Connect";
import LinearProgress from "@mui/material/LinearProgress";
import MyTabBar from "../../components/ui/MyTabBar";
import * as React from "react";
import Image from "next/image";
const MyNFTs: NextPage = (props) => {
  const isMounted = useIsMounted();
  const { activeConnector } = useConnect();
  const { data: account } = useAccount();
  const { profile, isPendingProfile, errorProfile } = useGetMyProfile();
  const { data, isPending, error } = useGetMyNFT();
  const {
    data: balance,
    isError,
    isLoading,
  } = useBalance({
    addressOrName: account?.address,
    chainId: 5, //TODO Rinkeby => 4, Local network=>1337,Goerli=>5
  });
  const nftEls = data.map((salesOrder) => {
    return (
      <Grid key={salesOrder.id} item xs={3}>
        <NFTcard
          id={salesOrder.id}
          price={salesOrder.price}
          name={salesOrder.name}
          image={salesOrder.image}
          listed={salesOrder.listed}
          ownerWalletAddress={salesOrder.ownerWalletAddress}
        ></NFTcard>
      </Grid>
    );
  });
  function srcset(
    image: string,
    width: number,
    height: number,
    rows = 1,
    cols = 1
  ) {
    return {
      src: `${image}?w=${width * cols}&h=${height * rows}&fit=crop&auto=format`,
      srcSet: `${image}?w=${width * cols}&h=${
        height * rows
      }&fit=crop&auto=format&dpr=2 2x`,
    };
  }
  return isMounted && activeConnector && !isPendingProfile ? (
    <Box>
      {profile?.bannerImage && (
        <ImageListItem>
          <img
            {...srcset(profile?.bannerImage, 250, 200, 5, 12)}
            alt="banner"
            loading="lazy"
          />

          <Stack direction="row" spacing={2}>
            <Avatar
              alt="Remy Sharp"
              src={profile?.profileImage}
              sx={{ width: 100, height: 100, boxShadow: 3, mt: -10, ml: 2 }}
            />
          </Stack>
        </ImageListItem>
      )}
      <Container sx={{ pt: 5 }}>
        <Typography variant="h2" sx={{ mt: 1 }} gutterBottom>
          {profile?.userName}
        </Typography>
        <Typography variant="h4" sx={{ mt: 1 }} gutterBottom>
          <Image
            height={30}
            width={30}
            src={"/ethereum.png"}
            alt={"logo"}
            loading="lazy"
          />
          {account?.address}
        </Typography>
        <Typography variant="h4" sx={{ mt: 1 }} gutterBottom>
          Account balance: {balance?.formatted} {balance?.symbol}
        </Typography>

        <Button
          variant="contained"
          size="small"
          color="secondary"
          href="/account/edit"
        >
          <Typography color="white" variant="h6">
            Edit profile
          </Typography>
        </Button>
        {isMounted && activeConnector ? (
          <Box>
            {isPending && (
              <Box sx={{ width: "100%" }}>
                <LinearProgress />
              </Box>
            )}
            {data.length === 0 ? (
              <Typography color="black" align="center" variant="h2">
                No NFT Exit
              </Typography>
            ) : (
              <MyTabBar nfts={data} />
            )}
          </Box>
        ) : (
          <Connect />
        )}
      </Container>
    </Box>
  ) : (
    <Box sx={{ width: "100%" }}>
      <LinearProgress />
    </Box>
  );
};

export default MyNFTs;
