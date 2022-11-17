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
  LinearProgress,
  Tooltip,
  Card,
  CardMedia,
} from "@mui/material";
import { useAccount, useConnect, useBalance } from "wagmi";
import {
  useGetMyNFT,
  useIsMounted,
  useGetMyProfile,
} from "../../components/hooks";
import Connect from "../../components/Login/Connect";
import MyTabBar from "../../components/ui/MyTabBar";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
const MyNFTs: NextPage = (props) => {
  const isMounted = useIsMounted();
  const { activeConnector, connect, connectors } = useConnect();
  const { data: account } = useAccount();
  const { profile, isPendingProfile, errorProfile, isAdmin, isSuperAdmin } =
    useGetMyProfile();
  const { collectedNFTCard, createdNFTCard, isPending, error } = useGetMyNFT();
  const router = useRouter();
  const [isCopied, setIsCopied] = useState(false);
  const [copyValue, setCopyValue] = useState(account?.address);
  const { data, isError, isLoading } = useBalance({
    addressOrName: account?.address,
    chainId: 5, //TODO Rinkeby => 4, Local network=>1337,Goerli=>5
  });
  // console.log(data);
  // console.log(account?.address);
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
          {/* <img
            {...srcset(profile?.bannerImage, 250, 200, 3, 9)}
            alt="banner"
            loading="lazy"
          /> */}
          <Card sx={{ display: "flex", boxShadow: 0 }}>
            <CardMedia
              component="img"
              image={profile?.bannerImage}
              alt="Banner image"
              sx={{
                height: 400,
                width: 1850,
              }}
            />
          </Card>

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
        <Typography variant="h4" sx={{ mt: 0, fontWeight: 600 }} gutterBottom>
          <Image
            height={16.248}
            width={12}
            src={"/ethereum1.png"}
            alt={"logo"}
            loading="lazy"
          />
          {"   "}
          <CopyToClipboard
            text={copyValue ? copyValue : ""}
            onCopy={() => setIsCopied(true)}
          >
            <Tooltip title="Copy" placement="right" arrow>
              <Button
                sx={{
                  //backgroundColor: "#eeeeee",
                  backgroundColor: "#fefefe",
                  borderRadius: 4,
                  color: "#3366CC",
                }}
              >
                {account?.address?.slice(0, 10)}......
                {account?.address?.slice(35)}
              </Button>
            </Tooltip>
          </CopyToClipboard>
        </Typography>

        {/*<Typography
          variant="h4"
          sx={{ mt: 1, mb: 3, fontWeight: 500 }}
          gutterBottom
        >
          Account balance: {data?.formatted} {data?.symbol}
        </Typography>*/}

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
              {!isPending &&
              collectedNFTCard.length === 0 &&
              createdNFTCard.length === 0 ? (
                <Box>
                  <Divider sx={{ mt: 3 }} />
                  <Typography
                    color="black"
                    align="center"
                    variant="h3"
                    sx={{ mt: 3, mb: 5 }}
                  >
                    No NFTs Exists!
                  </Typography>
                </Box>
              ) : (
                <MyTabBar
                  collectedNFTCard={collectedNFTCard}
                  createdNFTCard={createdNFTCard}
                />
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
