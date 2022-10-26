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
} from "@mui/material";
import { useBalance } from "wagmi";
import { useIsMounted } from "../../../../components/hooks";
import Connect from "../../../../components/Login/Connect";
import Image from "next/image";
import api from "../../../../lib/api";
import UserTabBar from "../../../../components/ui/User/UserTabBar";
import { Collection_Card, NFT_Card, Profile } from "../../../../src/interfaces";
interface UserProfileProps {
  collectedNFTCards: Collection_Card[];
  createdNFTCards: NFT_Card[];
  collectionCards: NFT_Card[];
  userProfile: Profile;
}
const UserProfile: NextPage<UserProfileProps> = ({
      collectedNFTCards,
      createdNFTCards,
      collectionCards,
      userProfile,
    }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const isMounted = useIsMounted();
  const {
    data: balance,
    isError,
    isLoading,
  } = useBalance({
    addressOrName: userProfile.walletAddress,
    chainId: 5, //TODO Rinkeby => 4, Local network=>1337,Goerli=>5
  });
  // console.log(balance);
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
      <Container sx={{ pt: 5 }}>
        <Typography variant="h2" sx={{ mt: -3 }} gutterBottom>
          {userProfile.userName}
        </Typography>
        <Typography variant="h4" sx={{ mt: 0, fontWeight: 500 }} gutterBottom>
          <Image
            height={17}
            width={17}
            src={"/ethereum.png"}
            alt={"logo"}
            loading="lazy"
          />
          {userProfile.walletAddress}
        </Typography>
        <Typography
          variant="h4"
          sx={{ mt: 1, mb: 3, fontWeight: 500 }}
          gutterBottom
        >
          Account balance: {balance?.formatted} {balance?.symbol}
        </Typography>
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
      },
      revalidate: 1,
    };
  } catch (error) {
    // console.log(error);
    return { notFound: true };
  }
};
export default UserProfile;
