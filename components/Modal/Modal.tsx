import React, {
  ChangeEvent,
  FC,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useRouter } from "next/router";
import { Typography } from "@mui/material";

type AlertDialogProps = {
  msg: string;
  open: boolean;
  setOpen: (openModal: boolean) => void;
  setMsg: (msg: string) => void;
};
const AlertDialog: FC<AlertDialogProps> = (props) => {
  const router = useRouter();
  const handleClose = () => {
    props.setOpen(false);
    props.setMsg("");
    router.push("/explore-collections");
  };

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          sx={{
            backgroundColor: "#CA82FF",
            color: "white",
          }}
          id="alert-dialog-title"
        >
          {/* {"Status"} */}
          <Typography
            variant="h5"
            component="div"
            style={{ flexGrow: 1, fontWeight: 600 }}
          >
            Status
          </Typography>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            fontWeight: 100,
            width: "400px",
          }}
        >
          <DialogContentText
            id="alert-dialog-description"
            sx={{ fontSize: 18, fontWeight: 500 }}
          >
            {props.msg}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            <Typography
              variant="button"
              display="block"
              sx={{ fontSize: 18, fontWeight: 500 }}
              gutterBottom
            >
              OK
            </Typography>
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default AlertDialog;
