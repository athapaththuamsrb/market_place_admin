import { FC } from "react";
import { Box, Grid } from "@mui/material";

interface NFTGridProps {
  nftCardEls: JSX.Element[];
}

const NFTGrid: FC<NFTGridProps> = ({ nftCardEls }) => {
  return (
    <div>
      <Box sx={{ width: "90%", marginX: "auto", marginBottom: "72px" }}>
        <Grid
          container
          spacing={1}
          rowSpacing={3}
          maxWidth={2000}
          columnSpacing={{ sm: 2, md: 3, lg: 3 }}
        >
          {nftCardEls.map((nftCardEl, index) => (
            <Grid item key={index} xs={12} sm={6} md={3} lg={3}>
              {nftCardEl}
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
};

export default NFTGrid;
