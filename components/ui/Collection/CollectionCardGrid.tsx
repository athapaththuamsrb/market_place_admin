import { FC } from "react";
import { Box, Grid, Paper, experimentalStyled as styled } from "@mui/material";

interface NFTGridProps {
  collectionCardEls: JSX.Element[];
}

const CardGrid: FC<NFTGridProps> = ({ collectionCardEls }) => {
  return (
    <div>
      <Box sx={{ width: "90%", marginX: "auto", marginBottom: "72px" }}>
        <Grid
          container
          spacing={1}
          rowSpacing={3}
          maxWidth={2000}
          columnSpacing={{ sm: 2, md: 3 ,lg:3}}
          //justifyContent="space-evenly"
        >
          {collectionCardEls.map((collectionCardEl, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={4}>
              {collectionCardEl}
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
};

export default CardGrid;
