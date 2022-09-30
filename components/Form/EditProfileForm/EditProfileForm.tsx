import React, { FC, SyntheticEvent, useState } from "react";
import { useFormik } from "formik";
import { styled } from "@mui/material/styles";
import {
  Button,
  Typography,
  TextField,
  Avatar,
  Stack,
  Box,
  Grid,
} from "@mui/material";
import ModalPopUp from "../../Modal";
import axios from "axios";
import { useAccount } from "wagmi";
import * as Yup from "yup";

type CreateFormProps = {
  setMsg: (msg: string) => void;
  open: boolean;
  msg: string;
  setOpen: (open: boolean) => void;
};

const Input = styled("input")({
  display: "none",
});

const CreateForm: FC<CreateFormProps> = (props) => {
  const { data: account } = useAccount();
  const [image, setImage] = useState<{
    profileImage: string | ArrayBuffer | null;
    bannerImage: string | ArrayBuffer | null;
  }>({
    profileImage:
      "/default-avatar-profile-icon-vector-default-avatar-profile-icon-vector-social-media-user-image-vector-illustration-227787227.jpg",
    bannerImage: "/db5dbf90c8c83d650e1022220b4d707e.jpg",
  });
  const [imageSrc, setImageSrc] = useState<{
    profileImage: File | null;
    bannerImage: File | null;
  }>({
    profileImage: null,
    bannerImage: null,
  });
  function handleOnChange(
    e: React.FormEvent<HTMLInputElement | HTMLInputElement>,
    key: string
  ) {
    const target = e.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    switch (key) {
      case "profileImage":
        setImageSrc({ ...imageSrc, profileImage: file });
        break;
      case "bannerImage":
        setImageSrc({ ...imageSrc, bannerImage: file });
        break;
    }
    previewFiles(file, key);
  }
  function previewFiles(file: File, key: string) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      switch (key) {
        case "profileImage":
          setImage({ ...image, profileImage: reader.result });
          break;
        case "bannerImage":
          setImage({ ...image, bannerImage: reader.result });
          break;
      }
    };
  }

  const formik = useFormik({
    initialValues: {
      userName: "",
      bannerImage: undefined,
      profileImage: undefined,
    },
    validationSchema: Yup.object({
      userName: Yup.string()
        .trim()
        .min(5, "Give more than 5")
        .max(20, "can't exit  more than 20")
        .required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        if (
          imageSrc["profileImage"] !== null &&
          imageSrc["bannerImage"] !== null
        ) {
          const formDataProfile = new FormData();
          formDataProfile.append("file", imageSrc["profileImage"]);
          formDataProfile.append("upload_preset", "my-upload-profile");
          const res1 = await axios.post(
            "https://api.cloudinary.com/v1_1/dtrrkeb4a/image/upload",
            formDataProfile
          );
          const formDataBanner = new FormData();
          formDataBanner.append("file", imageSrc["bannerImage"]);
          formDataBanner.append("upload_preset", "my-upload-profile");
          const res2 = await axios.post(
            "https://api.cloudinary.com/v1_1/dtrrkeb4a/image/upload",
            formDataBanner
          );

          props.setMsg("processing.....");
          const res = await axios.post("/api/uploadFile", {
            data: {
              profileImageURL: res1.data.secure_url,
              bannerImageURL: res2.data.secure_url,
              userName: values.userName,
              folder: "profile",
              userwalletAddress: account?.address,
            },
          });
          props.setMsg(res.status === 201 ? "successfull!!" : "Try again!!");
          props.setOpen(true);
        }
      } catch (error) {
        props.setOpen(true);
        props.setMsg("Try again!!");
      }
    },
  });
  //TODO THIS IS USE FOR SHOW NFT IMAGE IN CONFIRM MODAL
  return (
    <Box sx={{ flexGrow: 1, width: "70%", marginX: "auto" }}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container textAlign={"center"} alignItems="center" spacing={0}>
          <Grid item xs={2}></Grid>
          <Grid item xs={8}>
            <label htmlFor="profileImage">
              <Typography variant="body2">
                This image will also be used for navigation. 350 x 350
                recommended.
              </Typography>
              <br />
              {image["profileImage"] && (
                <Stack alignItems="center">
                  <Avatar
                    alt="Remy Sharp"
                    src={image["profileImage"]}
                    sx={{
                      width: 150,
                      height: 150,
                      boxShadow: 3,
                    }}
                  />
                </Stack>
              )}
              <br />
              <Input
                name="profileImage"
                value={formik.values.profileImage}
                onChange={(e) => {
                  handleOnChange(e, "profileImage");
                }}
                accept="image/*"
                id="profileImage"
                multiple
                type="file"
              />
              <Button
                component="span"
                size="large"
                color="secondary"
                variant="contained"
              >
                <Typography color="white" variant="h3">
                  Upload Profile Image
                </Typography>
              </Button>
            </label>
            <br />
            <br />
            <label htmlFor="bannerImage">
              <Typography variant="body2">
                This image will appear at the top of your collection page. Avoid
                including too much text in this banner image, as the dimensions
                change on different devices. 1400 x 350 recommended.
              </Typography>
              <br />
              {image["bannerImage"] && (
                <Stack alignItems="center">
                  <Avatar
                    alt="Remy Sharp"
                    src={image["bannerImage"]}
                    sx={{
                      width: 500,
                      height: 200,
                      boxShadow: 3,
                    }}
                    variant="square"
                  />
                </Stack>
              )}
              <br />
              <Input
                name="bannerImage"
                value={formik.values.bannerImage}
                onChange={(e) => {
                  handleOnChange(e, "bannerImage");
                }}
                accept="image/*"
                id="bannerImage"
                multiple
                type="file"
              />
              <Button
                component="span"
                size="large"
                color="secondary"
                variant="contained"
              >
                <Typography color="white" variant="h3">
                  Upload Main Image
                </Typography>
              </Button>
            </label>
            <br />
            <br />
            <br />
            <br />
            <Box>
              <TextField
                sx={{ marginBottom: "30px" }}
                id="userName"
                name="userName"
                label="User Name"
                variant="outlined"
                fullWidth
                value={formik.values.userName}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
              {formik.touched.userName && formik.errors.userName ? (
                <Typography color="red" variant="body2">
                  {formik.errors.userName}
                </Typography>
              ) : null}
            </Box>
          </Grid>
          <Grid item xs={2}></Grid>
        </Grid>
        <Box textAlign={"center"} sx={{ marginTop: "70px" }}>
          <Button
            type="submit"
            disabled={
              formik.errors.userName !== undefined ||
              image["profileImage"] ===
                "/default-avatar-profile-icon-vector-default-avatar-profile-icon-vector-social-media-user-image-vector-illustration-227787227.jpg" ||
              image["bannerImage"] === "/db5dbf90c8c83d650e1022220b4d707e.jpg"
                ? true
                : false
            }
            style={{ borderWidth: "3px" }}
            size="large"
            color="secondary"
            variant="outlined"
          >
            <Typography variant="h2" color="secondary">
              Update Profile
            </Typography>
          </Button>
        </Box>
      </form>
      <ModalPopUp
        msg={props.msg}
        open={props.open}
        setOpen={props.setOpen}
        setMsg={props.setMsg}
      />
    </Box>
  );
};

export default CreateForm;
