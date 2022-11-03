import type {
  GetStaticProps,
  NextPage,
  GetStaticPaths,
  InferGetStaticPropsType,
} from "next";
import {
  Typography,
  Box,
  Container,
  Avatar,
  Stack,
  ImageListItem,
  Divider,
  LinearProgress,
  Card,
  CardHeader,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Grid,
} from "@mui/material";
import { useAccount, useBalance } from "wagmi";
import { useIsMounted } from "../../../../components/hooks";
import Connect from "../../../../components/Login/Connect";
import Image from "next/image";
import api from "../../../../lib/api";
import UserTabBar from "../../../../components/ui/User/UserTabBar";
import { Collection_Card, NFT_Card, Profile } from "../../../../src/interfaces";
import { props } from "cypress/types/bluebird";
import React, { useState } from "react";
import ReportPopup from "../../../../components/ReportPopup";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FlagIcon from "@mui/icons-material/Flag";

interface UserProfileProps {
  collectedNFTCards: Collection_Card[];
  createdNFTCards: NFT_Card[];
  collectionCards: NFT_Card[];
  userProfile: Profile;
  userId: string;
}
const UserProfile: NextPage<UserProfileProps> = ({
      collectedNFTCards,
      createdNFTCards,
      collectionCards,
      userProfile,
      userId,
    }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const isMounted = useIsMounted();
  const [openReportPopup, setOpenReportPopup] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open1 = Boolean(anchorEl);
  const { data: account } = useAccount();

  const {
    data: balance,
    isError,
    isLoading,
  } = useBalance({
    addressOrName: userProfile.walletAddress,
    chainId: 5, //TODO Rinkeby => 4, Local network=>1337,Goerli=>5
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
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return isMounted ? (
    <Box>
      {userProfile.bannerImage && (
        <ImageListItem>
          <img
            {...srcset(userProfile.bannerImage, 250, 200, 3, 9)}
            alt="banner"
            loading="lazy"
          />

          <Stack direction="row" spacing={2}>
            <Avatar
              alt="Remy Sharp"
              src={userProfile.profileImage}
              sx={{ width: 150, height: 150, boxShadow: 3, mt: "-7%", ml: 10 }}
            />
          </Stack>
        </ImageListItem>
      )}
      <Container sx={{ pt: 3 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={1}>
            <Grid item xs={11} sx={{marginBottom:"15px"}}>
              <Typography variant="h2" gutterBottom>
                {userProfile.userName}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, color:"gray" }} gutterBottom>
                <Image
                  height={17.248}
                  width={12}
                  src={"/ethereum1.png"}
                  alt={"logo"}
                  loading="lazy"
                />
                {userProfile.walletAddress}
              </Typography>
            </Grid>
            {account?.address && (
              <Grid item xs={1}>
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
                    Report User
                  </MenuItem>
                </Menu>
                <ReportPopup
                  reportedId={userId}
                  reportType={"USER"}
                  reporterId={account?.address}
                  openReportPopup={openReportPopup}
                  setOpenReportPopup={setOpenReportPopup}
                ></ReportPopup>
              </Grid>
            )}
          </Grid>
        </Box>

        {isMounted ? (
          <Box>
            <Box sx={{ marginBottom: "1%" }}>
              {collectedNFTCards.length === 0 &&
              createdNFTCards.length === 0 &&
              collectionCards.length === 0 ? (
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
                <UserTabBar
                  collectedNFTCards={collectedNFTCards}
                  createdNFTCards={createdNFTCards}
                  collectionCards={collectionCards}
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
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { params } = context;
  try {
    const { data } = await api.post("/getUser", {
      data: { userId: params?.userId },
    });
    if (!data.success) {
      return { notFound: true };
    }

    return {
      props: {
        collectedNFTCards: data.data.collectedNFTCards,
        createdNFTCards: data.data.createdNFTCards,
        collectionCards: data.data.collectionCards,
        userProfile: data.data.userProfile,
        userId: params?.userId,
      },
      revalidate: 1,
    };
  } catch (error) {
    return { notFound: true };
  }
};
export default UserProfile;
