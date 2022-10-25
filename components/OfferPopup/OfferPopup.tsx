import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Typography, IconButton, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { FC, SyntheticEvent, useState } from "react";
import { useFormik, Field } from "formik";
import axios, { Axios } from "axios";
import * as yup from "yup";
import { useAccount } from "wagmi";

const bigInt = require("big-integer");

type OfferPopupProps = {
  openPopup: boolean;
  setOpenPopup: (openPopup: boolean) => void;
  nftId: string;
  activity: string;
  endDate: string;
};
const OfferPopup: FC<OfferPopupProps> = ({
  openPopup,
  setOpenPopup,
  nftId,
  activity,
  endDate,
}) => {
  const { data: account } = useAccount();
  const [isPending, setIsPending] = useState(false);
  const [msg, setMsg] = useState("");
  const formik = useFormik({
    initialValues: {
      price: "",
      expireDate: "",
    },
    validationSchema: yup.object({
      price: yup.string().required("required field"),
      expireDate: yup.string().length(16).required("required field"),
    }),
    onSubmit: async (values: { price: string; expireDate: string }) => {
      try {
        setIsPending(true);
        setMsg("processing.....");
        const date = new Date(values.expireDate);
        //  timestamp in milliseconds(Unix timestamp)
        const timestampInMs = date.getTime();
        const res1 = await axios.post("/api/addBiding", {
          data: {
            nftId: nftId,
            price: values.price,
            endDate: timestampInMs,
            method: activity,
            walletAddress: account?.address,
          },
        });
        setMsg(res1.status === 201 ? "Successful!" : "Try again!!");
        setIsPending(false);
        formik.values.price = "";
        formik.values.expireDate = "";
        setOpenPopup(false);
      } catch (error) {
        setMsg("Try again!!");
      }
    },
  });
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
          {!isPending && (
            <IconButton
              onClick={() => {
                setOpenPopup(false);
              }}
            >
              <CloseIcon
                sx={{
                  color: "white",
                }}
              />
            </IconButton>
          )}
        </div>
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent
          dividers
          sx={{
            fontWeight: 100,
          }}
        >
          <TextField
            autoFocus
            margin="dense"
            id="price"
            label="Offer Amount"
            type="price"
            fullWidth
            variant="outlined"
            value={formik.values.price}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
          <TextField
            key={"expireDate"}
            id="expireDate"
            variant="outlined"
            fullWidth
            type="datetime-local"
            value={formik.values.expireDate}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            inputProps={{
              min: new Date(Date.now() + 24 * 60 * 60 * 1000)
                .toISOString()
                .slice(0, 16),
              max: new Date(bigInt(endDate)).toISOString().slice(0, 16),
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button
            disabled={isPending}
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
      </form>
    </Dialog>
  );
};

export default OfferPopup;
