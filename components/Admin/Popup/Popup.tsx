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
  const [User_ID, setUser_ID] = useState("");
  const [NameError, setNameError] = useState(false);
  const [User_IDError, setUser_IDError] = useState(false);

  const handleSubmit = async () => {
    setUser_IDError(false);
    setNameError(false);

    if (Name == "") {
      setNameError(true);
    }

    if (User_ID == "") {
      setUser_IDError(true);
    }

    if (Name && User_ID) {
      const newAdmin: User = users.find(
        (user: User) => user.User_ID === User_ID
      )!;
      axios.put("../../../api/addAdmin", { newAdmin }).then(() => {
        //console.log(newAdmin);
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
            style={{ flexGrow: 1, fontWeight: 600 }}
          >
            Admin Details Form
          </Typography>

          <IconButton
            onClick={() => {
              setName("");
              setUser_ID("");
              setUser_IDError(false);
              setNameError(false);
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
          label="Wallet Address"
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
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => {
            setName("");
            setUser_ID("");
            setUser_IDError(false);
            setNameError(false);
            setOpenPopup(false);
          }}
          size="small"
          color="primary"
          variant="outlined"
        >
          <Typography
            color="black"
            variant="h6"
            sx={{ fontWeight: 500, fontSize: "medium" }}
          >
            Cancel
          </Typography>
        </Button>
        <Button
          onClick={() => handleSubmit()}
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

export default Popup;
