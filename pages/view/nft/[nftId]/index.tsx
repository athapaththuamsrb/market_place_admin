import ViewNFT from "../../../../components/ViewNFT";
import type {
  GetStaticProps,
  NextPage,
  GetStaticPaths,
  InferGetStaticPropsType,
} from "next";
import { useRouter } from "next/router";
import { NFT_Card, NFT_load } from "../../../../src/interfaces";
import axios from "axios";
import { _TypedDataEncoder } from "ethers/lib/utils";
import { useIsMounted } from "../../../../components/hooks";
import LinearProgress from "@mui/material/LinearProgress";
import { Box } from "@mui/system";
import api from "../../../../lib/api";
interface ViewProps {
  nft: NFT_load;
  saleNum: number;
}
const View: NextPage<ViewProps> = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const router = useRouter();
  const isMounted = useIsMounted();
  if (router.isFallback || !isMounted) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <ViewNFT salesOrder={props.nft} saleNum={props.saleNum} />
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
      data: { id: params?.nftId },
    });
    if (data.data.nft.length === 0) {
      return { notFound: true };
    }
    return {
      props: {
        nft: data.data.nft[0],
        saleNum: data.data.saleNum,
      },
      revalidate: 60,
    };
  } catch (error) {
    return { notFound: true };
  }
};
export default View;
