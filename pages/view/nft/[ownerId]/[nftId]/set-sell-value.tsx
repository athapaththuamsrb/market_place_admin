import type {
  GetStaticProps,
  GetStaticPaths,
  NextPage,
  InferGetStaticPropsType,
} from "next";
import axios from "axios";
import { NFT_load } from "../../../../../src/interfaces";
import SetPrice from "../../../../../components/ViewNFT/SetPrice";
import { useAccount } from "wagmi";
import { Typography, Link } from "@mui/material";
import { useIsMounted } from "../../../../../components/hooks";
import LinearProgress from "@mui/material/LinearProgress";
import { Box } from "@mui/system";
interface ViewProps {
  nft: NFT_load;
}
const SetSellValue: NextPage<ViewProps> = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const isMounted = useIsMounted();
  const { data: account } = useAccount();
  return isMounted ? (
    <Box>
      {props.nft.walletAddress === account?.address ? (
        <SetPrice salesOrder={props.nft} />
      ) : (
        <Typography variant="h2" align="center">
          HAVEN{"'"}T PERMISSION TO ACCESS THIS PAGE GO EXPLORE PAGE{" "}
          <Link href="/explore-collection">HERE</Link>
        </Typography>
      )}
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
    return { props: { nft: data.data.nft[0] }, revalidate: 1 };
  } catch (error) {
    return { notFound: true };
  }
};
export default SetSellValue;
