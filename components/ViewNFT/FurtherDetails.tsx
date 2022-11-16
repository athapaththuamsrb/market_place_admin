import * as React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Card,
  Link,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoIcon from "@mui/icons-material/Info";
import { FC } from "react";

interface FurtherDetailsProps {
  tokenID: number;
  creatorUserID: string;
  creatorUserName: string;
  collectionID: string;
  collectionName: string;
  uri: string;
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
                sx={{ fontWeight: 500, fontSize: "15px" }}
              >
                <Link href={`../../user/${props.creatorUserID}`}>
                  {props.creatorUserName}
                </Link>
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
                sx={{ fontWeight: 500, fontSize: "15px" }}
              >
                <Link href={`../../collection/${props.collectionID}`}>
                  {props.collectionName}
                </Link>
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
