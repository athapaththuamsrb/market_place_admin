import * as React from "react";
import Title from "../components/ui/Title";
import CategoryNav from "../components/ui/CategoryNav";
import { NFT_card } from "../src/interfaces";
import api from "./../lib/api";
import { Box } from "@mui/system";
import LinearProgress from "@mui/material/LinearProgress";
import { useIsMounted } from "../components/hooks";
import type {
  GetStaticProps,
  NextPage,
  GetStaticPaths,
  InferGetStaticPropsType,
} from "next";
interface ExploreProps {
  nftList: NFT_card[];
}
const Home: NextPage<ExploreProps> = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const isMounted = useIsMounted();
  return isMounted ? (
    <Box>
      <Title firstWord="Explore" secondWord="NFTs" />
      <CategoryNav nfts={props.nftList} />
    </Box>
  ) : (
    <Box sx={{ width: "100%" }}>
      <LinearProgress />
    </Box>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    const { data } = await api.get("/getListNFT");
    return { props: { nftList: data.data }, revalidate: 60 };
  } catch (error) {
    console.log(error);
    return { notFound: true };
  }
};
export default Home;
