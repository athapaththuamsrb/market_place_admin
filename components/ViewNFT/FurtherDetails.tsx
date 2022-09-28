import { FC, useState } from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";

interface FurtherDetailsProps {
  tokenID: number;
  collection: string;
  uri: string;
  creator: string;
}
const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const FurtherDetails: FC<FurtherDetailsProps> = (props) => {
  const [expanded, setExpanded] = useState<string | false>("panel1");

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };
  return (
    <Accordion
      expanded={expanded === "panel1"}
      onChange={handleChange("panel1")}
    >
      <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
        <Typography
          sx={{ marginTop: "60px" }}
          variant="h4"
          align="center"
          color={"primary"}
        >
          Further Details :
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography
          sx={{ marginTop: "20px" }}
          variant="h4"
          align="center"
          color={"primary"}
        >
          Token ID : {props.tokenID}
        </Typography>
        <Typography
          sx={{ marginTop: "20px" }}
          variant="h4"
          align="center"
          color={"primary"}
        >
          Creator : {props.creator}
        </Typography>
        <Typography
          sx={{ marginTop: "20px" }}
          variant="h4"
          align="center"
          color={"primary"}
        >
          Token Standard : ERC721
        </Typography>
        <Typography
          sx={{ marginTop: "20px" }}
          variant="h4"
          align="center"
          color={"primary"}
        >
          Contract Address : {props.collection}
        </Typography>
        <Typography
          sx={{ marginTop: "20px" }}
          variant="h4"
          align="center"
          color={"primary"}
        >
          Blockchain : Etheruem
        </Typography>
        <Typography
          sx={{ marginTop: "20px" }}
          variant="h4"
          align="center"
          color={"primary"}
        >
          Metadata : {props.uri}
        </Typography>

        <Typography
          sx={{ marginTop: "20px" }}
          variant="h4"
          align="center"
          color={"primary"}
        >
          Creator Fee : 0%
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export default FurtherDetails;
