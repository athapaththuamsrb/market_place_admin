import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import {
  Typography,
  IconButton,
  Stack,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Alert,
  Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { FC, SyntheticEvent, useState } from "react";

type ReportPopupProps = {
  openReportPopup: boolean;
  setOpenReportPopup: (openPopup: boolean) => void;
  reportedId: any[];
  reportType: string;
  reporterId: string;
};
const ReportPopup: FC<ReportPopupProps> = ({
  reportedId,
  reportType,
  reporterId,
  openReportPopup,
  setOpenReportPopup,
}) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState(false);
  const [result, setResult] = useState(true);
  const [snackOpen, setSnackOpen] = useState(false);

  const handleCloseSnack = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackOpen(false);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setReason(event.target.value as string);
  };

  const handleSubmit = async () => {
    setError(false);
    if (reason == "") {
      setError(true);
    }
    if (reason) {
      try {
        const res1 = await axios.post("/api/addReport", {
          data: {
            reportedId: reportedId,
            reportType: reportType,
            reporterWalletAddress: reporterId,
            reason: reason,
          },
        });
        setResult(res1.status === 201 ? true : false);
        setReason("");
        setOpenReportPopup(false);
        setSnackOpen(true);
      } catch {
        setResult(false);
        setSnackOpen(true);
      }
    }
  };

  return (
    <Box>
      <Dialog open={openReportPopup}>
        <DialogTitle
          sx={{
            // backgroundColor: "#CA82FF",
            backgroundColor: "#b9b9b9",
            color: "white",
          }}
        >
          <div style={{ display: "flex" }}>
            <Typography
              variant="h5"
              component="div"
              style={{ flexGrow: 1, fontWeight: 600 }}
            >
              Report
              {reportType == "USER"
                ? " User"
                : reportType == "NFT"
                ? " NFT"
                : " Collection"}
            </Typography>
            <IconButton
              onClick={() => {
                setOpenReportPopup(false);
                setReason("");
                setError(false);
              }}
            >
              <CloseIcon
                sx={{
                  color: "black",
                }}
              />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            fontWeight: 100,
            width: "500px",
          }}
        >
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Reason</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={reason}
                label="Age"
                onChange={handleChange}
              >
                <MenuItem value={"Fake or possible scam"}>
                  Fake{" "}
                  {reportType == "USER"
                    ? " User"
                    : reportType == "NFT"
                    ? " NFT"
                    : " Collection"}{" "}
                  or possible scam
                </MenuItem>
                <MenuItem value={"Sensitive content"}>
                  Sensitive content
                </MenuItem>
                <MenuItem value={"Spam"}>Spam</MenuItem>
                <MenuItem value={"Other"}>Other</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            //onClick={() => handleChange(value)setOpenReportPopup(false)}
            onClick={() => handleSubmit()}
            type="submit"
            size="small"
            color="primary"
            variant="contained"
          >
            <Typography
              color="white"
              variant="h6"
              sx={{ fontWeight: 500, fontSize: "medium" }}
            >
              Submit
            </Typography>
          </Button>
        </DialogActions>
      </Dialog>

      {result && (
        <Snackbar
          open={snackOpen}
          autoHideDuration={5000}
          onClose={handleCloseSnack}
        >
          <Alert
            onClose={handleCloseSnack}
            severity="success"
            sx={{ width: "100%" }}
          >
            Report added successfully!
          </Alert>
        </Snackbar>
      )}
      {!result && (
        <Snackbar
          open={snackOpen}
          autoHideDuration={5000}
          onClose={handleCloseSnack}
        >
          <Alert
            onClose={handleCloseSnack}
            severity="error"
            sx={{ width: "100%" }}
          >
            Failed! Try again!
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default ReportPopup;
