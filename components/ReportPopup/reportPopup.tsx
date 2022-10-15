import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Typography, IconButton, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { FC, SyntheticEvent, useState } from "react";
import axios, { Axios } from "axios";
import {
  DatePicker,
  DesktopDateTimePicker,
  LocalizationProvider,
} from "@mui/lab";
import dayjs, { Dayjs } from "dayjs";

type ReportPopupProps = {
  openReportPopup: boolean;
  setOpenReportPopup: (openPopup: boolean) => void;
};
const ReportPopup: FC<ReportPopupProps> = ({
  openReportPopup,
  setOpenReportPopup,
}) => {
  const [value, setValue] = useState<Dayjs | null>(
    dayjs("2014-08-18T21:11:54")
  );

  return (
    <Dialog open={openReportPopup}>
      <DialogTitle
        sx={{
          backgroundColor: "#CA82FF",
          color: "white",
        }}
      >
        <div style={{ display: "flex" }}>
          <Typography
            variant="h5"
            component="div"
            style={{ flexGrow: 1, fontWeight: 600 }}
          >
            Report NFT
          </Typography>
          <IconButton
            onClick={() => {
              // setName("");
              // setUser_ID("");
              // setEmailAddress("");
              // setUser_IDError(false);
              // setNameError(false);
              // setEmailAddressError(false);
              setOpenReportPopup(false);
            }}
          >
            <CloseIcon
              sx={{
                color: "white",
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
        <TextField
          //value={Offer_Amount}
          //onChange={(e) => setUser_ID(e.target.value)}

          autoFocus
          margin="dense"
          id="Reason"
          label="Reason"
          multiline
          rows={4}
          type="text"
          fullWidth
          variant="outlined"
          required

          //error={Offer_AmountError}
        />
      </DialogContent>

      <DialogActions>
        <Button
          //onClick={() => handleChange(value)}
          onClick={() => setOpenReportPopup(false)}
          type="submit"
          size="small"
          color="secondary"
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
  );
};

export default ReportPopup;
