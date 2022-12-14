import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Title from "../../ui/Title";
import Link from "next/link";
import { Card, CardMedia, Grid } from "@mui/material";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "0px solid #000",
  boxShadow: 24,
  p: 10,
};

export default function BasicModal() {
  const [open, setOpen] = React.useState(true);

  return (
    <div>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Card sx={{ display: "flex", boxShadow: 0 }}>
            <CardMedia
              component="img"
              image={"public/../../../exclusives_new_logo.png"}
              alt="avatar"
              sx={{
                height: 260,
                borderRadius: 2,
              }}
            />
          </Card>
          <Title firstWord="Welcome to" secondWord="EXCLUSIVES" />
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Link href="/explore-collections" id="explore">
              <Button size="large" color="secondary" variant="contained">
                <Typography color="white" variant="h3">
                  Explore
                </Typography>
              </Button>
            </Link>
            <Link href="/create" id="create">
              <Button
                size="large"
                color="primary"
                variant="contained"
                sx={{
                  marginX: "10px",
                }}
              >
                <Typography color="white" variant="h3">
                  Create
                </Typography>
              </Button>
            </Link>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
}
