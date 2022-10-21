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
  Divider,
} from "@mui/material";
import NFTcard from "../../components/ui/NFT";
import { useAccount, useConnect, useBalance } from "wagmi";
import {
  useGetMyNFT,
  useIsMounted,
  useGetMyProfile,
  useGetMyCollectionCard,
} from "../../components/hooks";
import Connect from "../../components/Login/Connect";
import LinearProgress from "@mui/material/LinearProgress";
import MyTabBar from "../../components/ui/MyTabBar";
import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
const MyNFTs: NextPage = (props) => {
  const isMounted = useIsMounted();
  const { activeConnector, connect, connectors } = useConnect();
  const { data: account } = useAccount();
  const { profile, isPendingProfile, errorProfile } = useGetMyProfile();
  const { data, isPending, error } = useGetMyNFT();
  const { collectionCards, isPendingCollectionCard, errorCollectionCard } =
    useGetMyCollectionCard();
  const router = useRouter();
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
  useEffect(() => {
    if (!isPendingProfile && activeConnector === undefined) {
      router.push(`${router.basePath}/explore-collections`);
    }
  }, [activeConnector, isPendingProfile, router]);

  return isMounted && activeConnector && !isPendingProfile ? (
    <Box>
      {profile?.bannerImage && (
        <ImageListItem>
          <img
            {...srcset(profile?.bannerImage, 250, 200, 3, 9)}
            alt="banner"
            loading="lazy"
          />

          <Stack direction="row" spacing={2}>
            <Avatar
              alt="Remy Sharp"
              src={profile?.profileImage}
              sx={{ width: 150, height: 150, boxShadow: 3, mt: "-7%", ml: 10 }}
            />
          </Stack>
        </ImageListItem>
      )}
      <Container sx={{ pt: 5 }}>
        <Typography variant="h2" sx={{ mt: -3 }} gutterBottom>
          {profile?.userName}
        </Typography>
        <Typography variant="h4" sx={{ mt: 0, fontWeight: 500 }} gutterBottom>
          <Image
            height={17}
            width={17}
            src={"/ethereum.png"}
            alt={"logo"}
            loading="lazy"
          />
          {account?.address}
        </Typography>
        <Typography
          variant="h4"
          sx={{ mt: 1, mb: 3, fontWeight: 500 }}
          gutterBottom
        >
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
              <Box sx={{ width: "100%", mt: 3 }}>
                <LinearProgress />
              </Box>
            )}

            <Box sx={{ marginBottom: "1%" }}>
              {data.length === 0 ? (
                <Box>
                  <Divider sx={{ mt: 3 }} />
                  <Typography
                    color="black"
                    align="center"
                    variant="h2"
                    sx={{ mt: 3 }}
                  >
                    No NFTs Exists!
                  </Typography>
                </Box>
              ) : (
                <MyTabBar nfts={data} />
              )}
            </Box>
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
