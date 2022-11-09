import type { NextPage } from "next";
import { Container, Typography, Box, Button, Grid } from "@mui/material";
import CollectionCard from "../../../components/ui/Collection/CollectionCard";
import CollectionCardGrid from "../../../components/ui/Collection/CollectionCardGrid";
import { useAccount, useConnect } from "wagmi";
import {
  useGetMyCollectionCard,
  useIsMounted,
} from "../../../components/hooks";
import Connect from "../../../components/Login/Connect";
import LinearProgress from "@mui/material/LinearProgress";
import Title from "../../../components/ui/Title";

const Collection: NextPage = (props) => {
  const isMounted = useIsMounted();
  const { activeConnector } = useConnect();
  const { collectionCards, isPendingCollectionCards, errorCollectionCards } =
    useGetMyCollectionCard();

  const collectionEls = collectionCards.map((salesOrder) => {
    return (
      <Grid key={salesOrder.id} item xs={12}>
        <CollectionCard
          id={salesOrder.id}
          collectionName={salesOrder.collectionName}
          featuredImage={salesOrder.featuredImage}
          logoImage={salesOrder.logoImage}
        />
      </Grid>
    );
  });

  return isMounted && activeConnector ? (
    <Box sx={{ pt: 5 }}>
      <Container>
        <Title firstWord="My" secondWord="Collection" />
        <Typography variant="h6" gutterBottom align="center">
          Create, curate, and manage collections of unique NFTs to share and
          sell.
        </Typography>
        <Button
          href="/account/collection/create"
          size="small"
          color="secondary"
          variant="contained"
        >
          <Typography color="white" variant="h6" sx={{ fontWeight: 500 }}>
            Create a collection
          </Typography>
        </Button>
        <Box>
          <br />
          {isPendingCollectionCards && (
            <Box sx={{ width: "100%" }}>
              <LinearProgress />
            </Box>
          )}
          <br />
          {!isPendingCollectionCards && collectionCards.length === 0 ? (
            <Typography color="black" align="center" variant="h3">
              No Collection Exists
            </Typography>
          ) : (
            <CollectionCardGrid collectionCardEls={collectionEls} />
          )}
        </Box>
      </Container>
    </Box>
  ) : (
    <Connect />
  );
};
export default Collection;
