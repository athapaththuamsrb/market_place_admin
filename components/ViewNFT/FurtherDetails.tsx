import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoIcon from "@mui/icons-material/Info";
import CardContent from "@mui/material/CardContent";

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
              <Typography variant="h4">Creator :</Typography>
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
          {/* <Typography
            sx={{
              fontWeight: 400,
              fontSize: 15,
            }}
            variant="h4"
            align="left"
          >
            Token ID : {props.tokenID}
          </Typography>
          <Typography
            sx={{
              marginTop: "10px",
              fontWeight: 400,
              fontSize: 15,
            }}
            variant="h4"
            align="left"
          >
            Creator : {props.creator}
          </Typography>
          <Typography
            sx={{
              marginTop: "10px",
              fontWeight: 400,
              fontSize: 15,
            }}
            variant="h4"
            align="left"
          >
            Token Standard : ERC721
          </Typography>
          <Typography
            sx={{
              marginTop: "10px",
              fontWeight: 400,
              fontSize: 15,
            }}
            variant="h4"
            align="left"
          >
            Contract Address : {props.collection}
          </Typography>
          <Typography
            sx={{
              marginTop: "10px",
              fontWeight: 400,
              fontSize: 15,
            }}
            variant="h4"
            align="left"
          >
            Blockchain : Etheruem
          </Typography>
          <Typography
            sx={{
              marginTop: "10px",
              fontWeight: 400,
              fontSize: 15,
            }}
            variant="h4"
            align="left"
          >
            Metadata : {props.uri}
          </Typography>

          <Typography
            sx={{
              marginTop: "10px",
              fontWeight: 400,
              fontSize: 15,
            }}
            variant="h4"
            align="left"
          >
            Creator Fee : 0%
          </Typography> */}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
export default FurtherDetails;
