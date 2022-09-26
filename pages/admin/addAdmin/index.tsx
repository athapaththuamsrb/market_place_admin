import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function poo(props) {
  const { title, children, openPopup, setOpenPopup } = props;

  return (
    <Dialog open={openPopup}>
      <DialogTitle>Admin Details Form</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="User_ID"
          label="User_ID"
          type="text"
          fullWidth
          variant="outlined"
        />
        <TextField
          autoFocus
          margin="dense"
          id="Name"
          label="Name"
          type="text"
          fullWidth
          variant="outlined"
        />
        <TextField
          autoFocus
          margin="dense"
          id="Tele"
          label="Name"
          type="text"
          fullWidth
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button >Cancel</Button>
        <Button >Subscribe</Button>
      </DialogActions>
    </Dialog>
  );
  // const [open, setOpen] = React.useState(false);

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  // const handleClose = () => {
  //   setOpen(false);
  // };

  // return (
  //   <div>
  //     <Button variant="outlined" onClick={handleClickOpen}>
  //       Open form dialog
  //     </Button>
  //     <Dialog open={open} onClose={handleClose}>
  //     <DialogTitle>Admin Details Form</DialogTitle>
  //       <DialogContent>
  //         <TextField
  //           autoFocus
  //           margin="dense"
  //           id="User_ID"
  //           label="User_ID"
  //           type="text"
  //           fullWidth
  //           variant="outlined"
  //         />
  //         <TextField
  //           autoFocus
  //           margin="dense"
  //           id="Name"
  //           label="Name"
  //           type="text"
  //           fullWidth
  //           variant="outlined"
  //         />
  //         <TextField
  //           autoFocus
  //           margin="dense"
  //           id="Tele"
  //           label="Name"
  //           type="text"
  //           fullWidth
  //           variant="outlined"
  //         />
  //       </DialogContent>
  //       <DialogActions>
  //         <Button onClick={handleClose}>Cancel</Button>
  //         <Button onClick={handleClose}>Subscribe</Button>
  //       </DialogActions>
  //     </Dialog>
  //   </div>
  // );
}
