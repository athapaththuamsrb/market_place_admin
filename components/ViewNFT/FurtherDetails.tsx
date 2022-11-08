import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoIcon from "@mui/icons-material/Info";
import CardContent from "@mui/material/CardContent";
import theme from "../../src/theme";

import { FC, useState } from "react";
import Card from "@mui/material/Card";

interface FurtherDetailsProps {
  tokenID: number;
  collection: string;
  uri: string;
  creator: string;
}

const FurtherDetails: FC<FurtherDetailsProps> = (props) => {
  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <InfoIcon
            sx={{
              marginRight: "10px",
            }}
          ></InfoIcon>
          <Typography>Further Details</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Card
            sx={{
              boxShadow: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <Typography variant="h4">Token ID :</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 500, fontSize: "15px" }}
              >
                {props.tokenID}
              </Typography>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <Typography variant="h4" sx={{ minWidth: "20%" }}>
                Creator :
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 500, fontSize: "13px" }}
              >
                {props.creator}
              </Typography>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <Typography variant="h4">Token Standard :</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 500, fontSize: "15px" }}
              >
                ERC721
              </Typography>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <Typography variant="h4">Collection :</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 500, fontSize: "13px" }}
              >
                {props.collection}
              </Typography>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <Typography variant="h4">Blockchain :</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 500, fontSize: "15px" }}
              >
                Ethereum
              </Typography>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <Typography variant="h4">Metadata :</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 500, fontSize: "15px" }}
              >
                Centralized
              </Typography>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <Typography variant="h4">Creator Fee :</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 500, fontSize: "15px" }}
              >
                0%
              </Typography>
            </div>
          </Card>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
export default FurtherDetails;
