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
  saleNum: number;
  ownerID: string;
}
const View: NextPage<ViewProps> = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const isMounted = useIsMounted();
  return isMounted ? (
    <Box>
      <ViewNFT
        salesOrder={props.nft}
        saleNum={props.saleNum}
        ownerID={props.ownerID}
      />
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
    const { data } = await axios.post("/getNFT", {
      data: { id: params?.nftId, ownerId: params?.ownerId },
    });
    if (data.data.nft.length === 0) {
      return { notFound: true };
    }
    return {
      props: {
        nft: data.data.nft[0],
        saleNum: data.data.saleNum,
        ownerID: params?.ownerId,
      },
      revalidate: 1,
    };
  } catch (error) {
    return { notFound: true };
  }
};
export default View;
