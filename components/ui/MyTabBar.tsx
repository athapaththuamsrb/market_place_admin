import { useState } from "react";
import { FC } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { NFT_card } from "../../src/interfaces";
import { Grid } from "@mui/material";
import NFT from "./NFT";
import NFTGrid from "./NFTGrid";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
type CategoryNavProps = {
  nfts: NFT_card[];
};
const MyTabBar: FC<CategoryNavProps> = (props) => {
  const [value, setValue] = useState("Collection");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const tabs = ["Collection", "Created"];
  const nftPanel = tabs.map((item) => {
    let filternfts: NFT_card[] = props.nfts;
    const nftEls = filternfts.map((salesOrder) => {
      return (
        <Grid key={salesOrder.id} item xs={3} sx={{marginTop:-6, marginLeft:-10}}>
          <NFT
            id={salesOrder.id}
            listed={salesOrder.listed}
            price={salesOrder.price}
            name={salesOrder.name}
            image={salesOrder.image}
            ownerWalletAddress={salesOrder.ownerWalletAddress}
          ></NFT>
        </Grid>
      );
    });
    return (
      <TabPanel value={item} key={item}>
        <NFTGrid nftCardEls={nftEls} />
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
        <Box sx={{ marginX: "auto", marginBottom: "72px" }}>
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
