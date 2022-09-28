import { FC } from "react";
import { NFT as NFTtype, SalesOrder } from "../../src/interfaces";
import { Box, Grid } from "@mui/material";
import NFT from "./NFT";

interface NFTGridProps {
  nftCardEls: JSX.Element[];
}

const NFTGrid: FC<NFTGridProps> = (props) => {
  return (
    <div>
      <Box sx={{ width: "90%", marginX: "auto", marginBottom: "72px" }}>
        <Grid container spacing={8}>
          {props.nftCardEls}
        </Grid>
      </Box>
    </div>
  );
};

export default NFTGrid;
