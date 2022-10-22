import { FC } from "react";
import { Box, Grid } from "@mui/material";

interface NFTGridProps {
  nftCardEls: JSX.Element[];
}

const NFTGrid: FC<NFTGridProps> = ({ nftCardEls }) => {
  return (
    <div>
      <Box sx={{ width: "90%", marginX: "auto", marginBottom: "72px" }}>
        <Grid container spacing={8}>
          {nftCardEls}
        </Grid>
      </Box>
    </div>
  );
};

export default NFTGrid;
