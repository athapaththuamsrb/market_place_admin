import * as React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Card,
  Tooltip,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoIcon from "@mui/icons-material/Info";
import theme from "../../src/theme";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FC, useState } from "react";

interface FurtherDetailsProps {
  tokenID: number;
  collection: string;
  uri: string;
  creator: string;
}

const FurtherDetails: FC<FurtherDetailsProps> = (props) => {
  const [isCopied, setIsCopied] = useState(false);
  const [copyValue, setCopyValue] = useState(props.creator);
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
                <CopyToClipboard
                  text={copyValue ? copyValue : ""}
                  onCopy={() => setIsCopied(true)}
                >
                  <Tooltip title="Copy" placement="bottom" arrow>
                    <Button
                      sx={{
                        //backgroundColor: "#eeeeee",
                        backgroundColor: "#fefefe",
                        borderRadius: 1,
                        color: "#3366CC",
                        padding:0
                      }}
                    >
                      {props.creator.slice(0,10)}...{props.creator.slice(35)}
                    </Button>
                  </Tooltip>
                </CopyToClipboard>
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
