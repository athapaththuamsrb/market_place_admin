import { FC } from "react";
import NFT from "../components/ui/NFT";
import { NFTData } from "../src/interfaces";
import { Button, Typography } from "@mui/material";
import NFTCreator from "../components/ui/NFTCreator";
import Title from "../components/ui/Title";

const componentTest: FC = () => {
  const exampleData: NFTData = {
    tokenID: 1,
    uri: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg",
    price: 1,
    creator: "Devaka Dias",
    name: "tree",
  };
  return (
    <div>
      <Title firstWord="NFT" secondWord="Creators" />
      <NFT nftData={exampleData} />
      <Button size="medium" color="secondary" variant="contained">
        <Typography color="white" variant="h3">
          Example 1
        </Typography>
      </Button>
      <Button
        style={{ borderWidth: "3px" }}
        size="medium"
        color="secondary"
        variant="outlined"
      >
        <Typography variant="h3" color="secondary">
          Example 2
        </Typography>
      </Button>
      <NFTCreator
        name="Devaka Dias"
        image="https://marketresearchtelecast.com/wp-content/uploads/2022/03/img_62301c7110a1a.jpg"
      />
    </div>
  );
};

export default componentTest;
