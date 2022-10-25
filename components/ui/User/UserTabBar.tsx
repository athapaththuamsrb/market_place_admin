import { useState } from "react";
import { FC } from "react";
import { Box, Tabs, Tab, LinearProgress } from "@mui/material";
import { Collection_Card, NFT_Card } from "../../../src/interfaces";
import { Grid } from "@mui/material";
import NFTCard from "../NFT/NFTCard";
import NFTCardGrid from "../NFT/NFTCardGrid";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import CollectionCard from "../Collection/CollectionCard";
import CollectionCardGrid from "../Collection/CollectionCardGrid";
type CategoryNavProps = {
  collectedNFTCards: NFT_Card[];
  createdNFTCards: NFT_Card[];
  collectionCards: Collection_Card[];
};
const UserTabBar: FC<CategoryNavProps> = ({
  collectedNFTCards,
  createdNFTCards,
  collectionCards,
}) => {
  const [value, setValue] = useState("Collected");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const tabs = ["Collected", "Created", "Collection"];
  const panel = tabs.map((item) => {
    if (item === "Collected" || item === "Created") {
      let filternfts: NFT_Card[] =
        item === "Collected" ? collectedNFTCards : createdNFTCards;
      const nftEls = filternfts.map((salesOrder: NFT_Card) => {
        return (
          <Grid key={salesOrder.id} item xs={3}>
            <NFTCard
              id={salesOrder.id}
              listed={salesOrder.listed}
              price={salesOrder.price}
              name={salesOrder.name}
              image={salesOrder.image}
              ownerId={salesOrder.ownerId}
              ownerWalletAddress={salesOrder.ownerWalletAddress}
            ></NFTCard>
          </Grid>
        );
      });
      return (
        <TabPanel value={item} key={item}>
          <NFTCardGrid nftCardEls={nftEls} />
        </TabPanel>
      );
    } else {
      const collectionEls = collectionCards.map(
        (salesOrder: Collection_Card) => {
          return (
            <Grid key={salesOrder.id} item xs={3}>
              <CollectionCard
                id={salesOrder.id}
                collectionName={salesOrder.collectionName}
                featuredImage={salesOrder.featuredImage}
                logoImage={salesOrder.logoImage}
              />
            </Grid>
          );
        }
      );
      return (
        <TabPanel value={item} key={item}>
          <CollectionCardGrid collectionCardEls={collectionEls} />
        </TabPanel>
      );
    }
  });

  const tabEls = tabs.map((item) => {
    return (
      <Tab
        key={item}
        sx={{ fontSize: 20, fontWeight: 900 }}
        label={item}
        value={item}
      />
    );
  });
  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ marginX: "auto", marginBottom: "20px" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tabs
              centered
              value={value}
              onChange={handleChange}
              textColor="secondary"
              indicatorColor="secondary"
              aria-label="secondary tabs example"
              sx={{ borderBottom: "1px solid #808080" }}
            >
              {tabEls}
            </Tabs>
          </TabList>
        </Box>
        {panel}
      </TabContext>
    </Box>
  );
};

export default UserTabBar;
