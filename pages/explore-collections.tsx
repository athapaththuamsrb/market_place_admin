import * as React from "react";
import Title from "../components/ui/Title";
import CategoryNav from "../components/ui/CategoryNav";
import { Collection_Card } from "../src/interfaces";
import { Box } from "@mui/system";
import LinearProgress from "@mui/material/LinearProgress";
import { useIsMounted } from "../components/hooks";
import type { GetStaticProps, NextPage, InferGetStaticPropsType } from "next";
import api from "../lib/api";
interface ExploreProps {
  collectionList: Collection_Card[];
}
const Home: NextPage<ExploreProps> = ({
  collectionList,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const isMounted = useIsMounted();
  return isMounted ? (
    <Box>
      <Title firstWord="Explore" secondWord="NFTs" />
      <CategoryNav collections={collectionList} />
    </Box>
  ) : (
    <Box sx={{ width: "100%" }}>
      <LinearProgress />
    </Box>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  try {
    const { data } = await api.get("/getListCollection");
    return { props: { collectionList: data.data }, revalidate: 1 };
  } catch (error) {
    return { notFound: true };
  }
};
export default Home;
