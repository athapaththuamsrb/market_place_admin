import type { NextPage } from "next";
import { Container, Typography, Box, Button, Grid } from "@mui/material";
import NFTcard from "../../../components/ui/NFT";
import NFTGrid from "../../../components/ui/NFTGrid";
import { useAccount, useConnect } from "wagmi";
import { useGetMyNFT, useIsMounted } from "../../../components/hooks";
import Connect from "../../../components/Login/Connect";
import LinearProgress from "@mui/material/LinearProgress";
const Collection: NextPage = (props) => {
  const isMounted = useIsMounted();
  const { activeConnector } = useConnect();
  const { data: account } = useAccount();
  const { data, isPending, error } = useGetMyNFT();
  const nftEls = data.map((salesOrder) => {
    return (
      <Grid key={salesOrder.id} item xs={3}>
        <NFTcard
          id={salesOrder.id}
          price={salesOrder.price}
          name={salesOrder.name}
          image={salesOrder.image}
          listed={salesOrder.listed}
          ownerWalletAddress={salesOrder.ownerWalletAddress}
        ></NFTcard>
      </Grid>
    );
  });
  return isMounted && activeConnector ? (
    <Box sx={{ pt: 5 }}>
      <Container>
        <Typography variant="h1" gutterBottom>
          My Collection
        </Typography>
        <Typography variant="body2" gutterBottom>
          Create, curate, and manage collections of unique NFTs to share and
          sell.
        </Typography>
        <Button
          variant="contained"
          sx={{
            color: "white",
            backgroundColor: "blue",
            my: 3,
          }}
          href="/account/collection/create"
        >
          Create a collection
        </Button>
        {isMounted && activeConnector ? (
          <Box>
            {isPending && (
              <Box sx={{ width: "100%" }}>
                <LinearProgress />
              </Box>
            )}
            {data.length === 0 ? (
              <Typography color="black" align="center" variant="h2">
                No NFT Exit
              </Typography>
            ) : (
              <NFTGrid nftCardEls={nftEls} />
            )}
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
export default Collection;
