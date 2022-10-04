import type {
  GetStaticProps,
  GetStaticPaths,
  NextPage,
  InferGetStaticPropsType,
} from "next";
import api from "../../../../lib/api";
import { NFT_load } from "../../../../src/interfaces";
import SetPrice from "../../../../components/ViewNFT/SetPrice";
import { useAccount } from "wagmi";
import { Typography } from "@mui/material/";
import Link from "@mui/material/Link";
import { useIsMounted } from "../../../../components/hooks";
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
    fallback: true,
  };
};
export const getStaticProps: GetStaticProps = async (context) => {
  const { params } = context;
  try {
    const { data } = await api.post("/getNFT", {
      data: { id: params?.id, ownerWalletAddress: params?.owner },
    });
    if (data.data.length === 0) {
      return { notFound: true };
    }
    console.log(data);
    return { props: { nft: data.data[0] }, revalidate: 60 };
  } catch (error) {
    console.log(error);
    return { notFound: true };
  }
};
export default SetSellValue;
