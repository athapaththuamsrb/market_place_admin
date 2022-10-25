import { useState } from "react";
import { FC } from "react";
import { Box, Tabs, Tab, LinearProgress } from "@mui/material";
import { NFT_Card } from "../../src/interfaces";
import { Grid } from "@mui/material";
import NFTCard from "./NFT/NFTCard";
import NFTCardGrid from "./NFT/NFTCardGrid";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
type CategoryNavProps = {
  collectedNFTCard: NFT_Card[];
  createdNFTCard: NFT_Card[];
};
const MyTabBar: FC<CategoryNavProps> = ({
  collectedNFTCard,
  createdNFTCard,
}) => {
  const [value, setValue] = useState("Collected");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const [isPendding, setIsPendding] = useState(false);
  const tabs = ["Collected", "Created"];
  const nftPanel = tabs.map((item) => {
    let filternfts: NFT_Card[] =
      item === "Collected" ? collectedNFTCard : createdNFTCard;
    const nftEls = filternfts.map((salesOrder) => {
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
        {nftPanel}
      </TabContext>
    </Box>
  );
};

export default MyTabBar;
