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
        <DialogTitle id="alert-dialog-title">{"Creat status"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.msg}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default AlertDialog;
