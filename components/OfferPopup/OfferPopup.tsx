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

type OfferPopupProps = {
  openPopup: boolean;
  setOpenPopup: (openPopup: boolean) => void;
};
const OfferPopup: FC<OfferPopupProps> = ({ openPopup, setOpenPopup }) => {
  const [value, setValue] = useState<Dayjs | null>(
    dayjs("2014-08-18T21:11:54")
  );

  return (
    <Dialog open={openPopup}>
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
            Make Offer
          </Typography>
          <IconButton
            onClick={() => {
              // setName("");
              // setUser_ID("");
              // setEmailAddress("");
              // setUser_IDError(false);
              // setNameError(false);
              // setEmailAddressError(false);
              setOpenPopup(false);
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
        }}
      >
        <TextField
          //value={Offer_Amount}
          //onChange={(e) => setUser_ID(e.target.value)}
          autoFocus
          margin="dense"
          id="Offer_Amount"
          label="Offer Amount"
          type="text"
          fullWidth
          variant="outlined"
          required
          //error={Offer_AmountError}
        />
        <TextField
          //value={Expiration}
          //onChange={(e) => setName(e.target.value)}
          onChange={(e) => console.log("Set date")}
          autoFocus
          margin="dense"
          id="Expiration"
          fullWidth
          variant="outlined"
          required
          type="date"
          defaultValue={"01/01/2022"}
          // error={ExpirationError}
        />
      </DialogContent>

      <DialogActions>
        <Button
          //onClick={() => handleChange(value)}
          onClick={() => setOpenPopup(false)}
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

export default OfferPopup;
