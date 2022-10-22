import type {
  GetStaticProps,
  NextPage,
  InferGetStaticPropsType,
  GetStaticPaths,
} from "next";
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
import NFTCardGrid from "../../../../components/ui/NFT/NFTCardGrid";
import NFTCard from "../../../../components/ui/NFT/NFTCard";
import { useIsMounted } from "../../../../components/hooks";
import LinearProgress from "@mui/material/LinearProgress";
import api from "../../../../lib/api";
import { Collection_Profile, NFT_Card } from "../../../../src/interfaces";
import Image from "next/image";
import Paper from "@mui/material/Paper";

interface CollectionProps {
  nftList: NFT_Card[];
  collectionData: Collection_Profile;
}
const Collection: NextPage<CollectionProps> = ({
  nftList,
  collectionData,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const isMounted = useIsMounted();

  const nftEls = nftList.map((nft: NFT_Card) => {
    return (
      <Grid key={nft.id} item xs={3}>
        <NFTCard
          id={nft.id}
          price={nft.price}
          name={nft.name}
          image={nft.image}
          listed={nft.listed}
          ownerWalletAddress={nft.ownerWalletAddress}
          ownerId={nft.ownerId}
        />
      </Grid>
    );
  });

  const srcset = (
    image: string,
    width: number,
    height: number,
    rows = 1,
    cols = 1
  ) => {
    return {
      src: `${image}?w=${width * cols}&h=${height * rows}&fit=crop&auto=format`,
      srcSet: `${image}?w=${width * cols}&h=${
        height * rows
      }&fit=crop&auto=format&dpr=2 2x`,
    };
  };
  return isMounted ? (
    <Box>
      {collectionData.bannerImage && (
        <ImageListItem>
          <img
            {...srcset(collectionData.bannerImage, 250, 200, 3, 9)}
            alt="banner"
            loading="lazy"
          />

          <Stack direction="row" spacing={2}>
            <Avatar
              alt="Remy Sharp"
              src={collectionData?.logoImage}
              sx={{ width: 150, height: 150, boxShadow: 3, mt: "-7%", ml: 10 }}
              variant="rounded"
            />
          </Stack>
        </ImageListItem>
      )}
      <Container sx={{ pt: 5 }}>
        <Typography variant="h2" sx={{ mt: -3 }} gutterBottom>
          {collectionData.collectionName}
        </Typography>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={1}>
            <Grid item xs={2}>
              <Paper elevation={0}>
                <Image
                  height={20}
                  width={20}
                  src={"/ethereum.png"}
                  alt={"logo"}
                  loading="lazy"
                />{" "}
                {collectionData.totalVolume}
                {"K"}
                <br />
                {"total volume"}
              </Paper>
            </Grid>
            <Grid item xs={2}>
              <Paper elevation={0}>
                <Image
                  height={20}
                  width={20}
                  src={"/ethereum.png"}
                  alt={"logo"}
                  loading="lazy"
                />{" "}
                {collectionData.floorPrice}
                <br />
                {"floor price"}
              </Paper>
            </Grid>
            <Grid item xs={2}>
              <Paper elevation={0}>
                <Image
                  height={20}
                  width={20}
                  src={"/ethereum.png"}
                  alt={"logo"}
                  loading="lazy"
                />{" "}
                {collectionData.NFTcount}
                <br />
                {"number of NFT"}
              </Paper>
            </Grid>
          </Grid>
        </Box>
        <br />
        <br />
        <Box>
          <Box sx={{ marginBottom: "1%" }}>
            {nftList.length === 0 ? (
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
              <NFTCardGrid nftCardEls={nftEls} />
            )}
          </Box>
        </Box>
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
  try {
    const { params } = context;
    const { data } = await api.post("/getCollection", {
      data: { id: params?.collectionId },
    });

    if (!data.success) {
      return { notFound: true };
    }
    console.log({
      nftList: data.data.nftList,
      collectionData: data.data.collectionData,
    });
    return {
      props: {
        nftList: data.data.nftList,
        collectionData: data.data.collectionData,
      },
      revalidate: 1,
    };
  } catch (error) {
    return { notFound: true };
  }
};
export default Collection;
