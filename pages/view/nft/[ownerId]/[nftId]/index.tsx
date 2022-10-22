import ViewNFT from "../../../../../components/ViewNFT";
import type {
  GetStaticProps,
  NextPage,
  GetStaticPaths,
  InferGetStaticPropsType,
} from "next";
import api from "../../../../../lib/api";
import { NFT_load } from "../../../../../src/interfaces";
import { _TypedDataEncoder } from "ethers/lib/utils";
import { useIsMounted } from "../../../../../components/hooks";
import LinearProgress from "@mui/material/LinearProgress";
import { Box } from "@mui/system";
interface ViewProps {
  nft: NFT_load;
}
const View: NextPage<ViewProps> = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const isMounted = useIsMounted();
  // console.log(props.nft);
  return isMounted ? (
    <Box>
      <ViewNFT salesOrder={props.nft} />
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
    const { data } = await api.post("/getNFT", {
      data: { id: params?.nftId, ownerId: params?.ownerId },
    });
    if (data.data.length === 0) {
      return { notFound: true };
    }
    return { props: { nft: data.data[0] }, revalidate: 1 };
  } catch (error) {
    console.log(error);
    return { notFound: true };
  }
};
export default View;
