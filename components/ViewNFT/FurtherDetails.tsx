import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoIcon from "@mui/icons-material/Info";

import { FC, useState } from "react";

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
          <Typography
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
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
export default FurtherDetails;
