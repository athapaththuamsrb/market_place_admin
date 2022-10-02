import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { FC, SyntheticEvent, useState } from "react";
import { User } from "../../../src/interfaces";
import axios, { Axios } from "axios";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../../src/theme";

type AdminPopupProps = {
  openPopup: boolean;
  setOpenPopup: (openPopup: boolean) => void;
  users: User[];
};
const Popup: FC<AdminPopupProps> = ({ openPopup, setOpenPopup, users }) => {
  const [Name, setName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [User_ID, setUser_ID] = useState("");
  const [NameError, setNameError] = useState(false);
  const [emailAddressError, setEmailAddressError] = useState(false);
  const [User_IDError, setUser_IDError] = useState(false);

  const handleSubmit = async () => {
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
      const newAdmin: User = users.find(
        (user: User) => user.User_ID === User_ID
      )!;
      newAdmin.Type = "Admin";
      axios
        .put(`http://localhost:8000/users/${newAdmin.id}`, newAdmin)
        .then(() => {
          setEmailAddress("");
          setName("");
          setUser_ID("");
          setOpenPopup(false);
        });
      // const response = await fetch(
      //   `http://localhost:8000/users/${newAdmin.id}`,
      //   {
      //     method: "PUT",
      //     body: JSON.stringify(newAdmin),
      //     headers: { "Content-type": "application/json" },
      //   }
      // );
      // const data = await response.json();
      // console.log(data);
    }
  };

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
            style={{ flexGrow: 1, fontWeight: 500 }}
          >
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
          // variant="contained"
          // sx={{
          //   mx: 1,
          //   color: "#777777",
          //   backgroundColor: "white",
          // }}
          variant="outlined"
          sx={{ mx: 1 }}
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
        <Button
          variant="contained"
          type="submit"
          onClick={() => handleSubmit()}
          sx={{
            mx: 1,
            color: "white",
            backgroundColor: "#CA82FF",
            borderColor: "#CA82FF",
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Popup;
