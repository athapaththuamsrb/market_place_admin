import { FC } from "react";
import { Box, Grid, Paper, experimentalStyled as styled } from "@mui/material";

interface NFTGridProps {
  collectionCardEls: JSX.Element[];
}

const CardGrid: FC<NFTGridProps> = ({ collectionCardEls }) => {
  return (
    <div>
      <Box sx={{ width: "90%", marginX: "auto", marginBottom: "72px" }}>
        <Grid container spacing={1}>
          {collectionCardEls.map((collectionCardEl, index) => (
            <Grid item xs={6} key={index}>
              <Paper elevation={0}>{collectionCardEl}</Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
};

export default CardGrid;
