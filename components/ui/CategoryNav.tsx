import { useState } from "react";
import { FC } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { Collection_Card } from "../../src/interfaces";
import { Grid } from "@mui/material";
import CollectionCardGrid from "./Collection/CollectionCardGrid";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import CollectionCard from "./Collection/CollectionCard";
type CategoryNavProps = {
  collections: Collection_Card[];
};
const CategoryNav: FC<CategoryNavProps> = ({ collections }) => {
  const [value, setValue] = useState("All");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const tabs = [
    "All",
    "Art",
    "Collectibles",
    "Music",
    "Photography",
    "Sports",
    "Cards",
    "Nature",
    "Utility",
    "Virtual",
    "Worlds",
  ];
  const collectionPanel = tabs.map((item) => {
    let filtercollections: Collection_Card[] =
      item === "All"
        ? collections
        : collections.filter((collection) => item === collection.category);
    const collectionEls = filtercollections.map((collection) => {
      return (
        <Grid key={collection.id} item xs={3}>
          <CollectionCard
            id={collection.id}
            collectionName={collection.collectionName}
            logoImage={collection.logoImage}
            featuredImage={collection.featuredImage}
          />
        </Grid>
      );
    });
    return (
      <TabPanel value={item} key={item}>
        <CollectionCardGrid collectionCardEls={collectionEls} />
      </TabPanel>
    );
  });
  const tabEls = tabs.map((item) => {
    return (
      <Tab
        key={item}
        sx={{ fontSize: 20, marginX: "10px", fontWeight: 900 }}
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
              sx={{ borderBottom: "1px solid #808080", marginX: "auto" }}
            >
              {tabEls}
            </Tabs>
          </TabList>
        </Box>
        {collectionPanel}
      </TabContext>
    </Box>
  );
};

export default CategoryNav;
