import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

//import { useNavigate } from "react-router-dom";

export default function PopUp(props) {
  const { openPopup, setOpenPopup } = props;
  //const navigate = useNavigate();
  const [Name, setName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [User_ID, setUser_ID] = useState("");
  const [NameError, setNameError] = useState();
  const [emailAddressError, setEmailAddressError] = useState();
  const [User_IDError, setUser_IDError] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUser_IDError(false);
    setNameError(false);
    setEmailAddressError(false);

    if (Name == "") {
      setNameError(true);
    }

    if (emailAddress == "") {
      setEmailAddressError(true);
    }

    if (User_ID == "") {
      setUser_IDError(true);
    }

    if (Name && emailAddress && User_ID) {
      //console.log(User_ID, Name, emailAddress);
      const response = await fetch("http://localhost:8000/users", {
        method: "POST",
        body: JSON.stringify({
          User_ID,
          Name,
          Date: "2022/04/04",
          Total: 6,
          Created: 8,
          Volume: 10,
          Status: "active",
          Type: "Admin",
        }),
        headers: { "Content-type": "application/json" },
      });
      const data = await response.json();
      console.log(data);
      setOpenPopup(false);
      // fetch("../api/rows", {
      //   method: "POST",
      //   headers: { "Content-type": "application/json" },
      //   body: JSON.stringify({ User_ID, Name, emailAddress }),
      // });
    }
  };

  return (
    <Dialog open={openPopup}>
      <DialogTitle>
        <div style={{ display: "flex" }}>
          <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
            Admin Details Form
          </Typography>

          <IconButton
            onClick={() => {
              setName("");
              setUser_ID("");
              setEmailAddress("");
              setUser_IDError(false);
              setNameError(false);
              setEmailAddressError(false);
              setOpenPopup(false);
            }}
          >
            <CloseIcon color="error" />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent dividers>
        <TextField
          value={User_ID}
          onChange={(e) => setUser_ID(e.target.value)}
          autoFocus
          margin="dense"
          id="User_ID"
          label="User_ID"
          type="text"
          fullWidth
          variant="outlined"
          required
          error={User_IDError}
        />
        <TextField
          value={Name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          margin="dense"
          id="Name"
          label="Name"
          type="text"
          fullWidth
          variant="outlined"
          required
          error={NameError}
        />

        <TextField
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
          autoFocus
          margin="dense"
          id="email address"
          label="Email address"
          type="email address"
          fullWidth
          variant="outlined"
          required
          error={emailAddressError}
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={() => {
            setName("");
            setUser_ID("");
            setEmailAddress("");
            setUser_IDError(false);
            setNameError(false);
            setEmailAddressError(false);
            setOpenPopup(false);
          }}
        >
          Cancel
        </Button>
        <Button variant="contained" type="submit" onClick={handleSubmit}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
