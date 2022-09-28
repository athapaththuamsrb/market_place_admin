import React, { FC, SyntheticEvent, useState } from "react";
import { useFormik } from "formik";
import { styled } from "@mui/material/styles";
import {
  Box,
  Grid,
  Button,
  Typography,
  TextField,
  Avatar,
  Stack,
} from "@mui/material";
import axios from "axios";
import ModalPopUp from "../../Modal";
import { useAccount } from "wagmi";
import * as Yup from "Yup";

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
    logoImage: string | ArrayBuffer | null;
    bannerImage: string | ArrayBuffer | null;
    featuredImage: string | ArrayBuffer | null;
  }>({
    logoImage:
      "/default-avatar-profile-icon-vector-default-avatar-profile-icon-vector-social-media-user-image-vector-illustration-227787227.jpg",
    bannerImage: "/db5dbf90c8c83d650e1022220b4d707e.jpg",
    featuredImage: "/db5dbf90c8c83d650e1022220b4d707e.jpg",
  });
  const [imageSrc, setImageSrc] = useState<{
    logoImage: File | null;
    featuredImage: File | null;
    bannerImage: File | null;
  }>({
    logoImage: null,
    featuredImage: null,
    bannerImage: null,
  });
  function handleOnChange(
    e: React.FormEvent<HTMLInputElement | HTMLInputElement>,
    key: string
  ) {
    const target = e.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    switch (key) {
      case "logoImage":
        setImageSrc({ ...imageSrc, logoImage: file });
        break;
      case "bannerImage":
        setImageSrc({ ...imageSrc, bannerImage: file });
        break;
      case "featuredImage":
        setImageSrc({ ...imageSrc, featuredImage: file });
        break;
    }
    previewFiles(file, key);
  }

  function previewFiles(file: File, key: string) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      switch (key) {
        case "logoImage":
          setImage({ ...image, logoImage: reader.result });
          break;
        case "bannerImage":
          setImage({ ...image, bannerImage: reader.result });
          break;
        case "featuredImage":
          setImage({ ...image, featuredImage: reader.result });
          break;
      }
    };
  }

  const formik = useFormik({
    initialValues: {
      collectionName: "",
    },
    validationSchema: Yup.object({
      collectionName: Yup.string()
        .trim()
        .min(5, "Give more than 5")
        .max(20, "can't exit  more than 20")
        .required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        if (
          imageSrc["featuredImage"] !== null &&
          imageSrc["logoImage"] !== null &&
          imageSrc["bannerImage"] !== null
        ) {
          const formDataLogo = new FormData();
          formDataLogo.append("file", imageSrc["logoImage"]);
          formDataLogo.append("upload_preset", "my-upload-collection");
          const res1 = await axios.post(
            "https://api.cloudinary.com/v1_1/dtrrkeb4a/image/upload",
            formDataLogo
          );
          const formDataBanner = new FormData();
          formDataBanner.append("file", imageSrc["bannerImage"]);
          formDataBanner.append("upload_preset", "my-upload-collection");
          const res2 = await axios.post(
            "https://api.cloudinary.com/v1_1/dtrrkeb4a/image/upload",
            formDataBanner
          );
          const formDataFeatured = new FormData();
          formDataFeatured.append("file", imageSrc["featuredImage"]);
          formDataFeatured.append("upload_preset", "my-upload-collection");
          const res3 = await axios.post(
            "https://api.cloudinary.com/v1_1/dtrrkeb4a/image/upload",
            formDataBanner
          );
          const address = "swdebuec"; //TODO get collection address
          props.setMsg("processing.....");
          const res = await axios.post("/api/uploadFile", {
            data: {
              profileImageURL: res1.data.secure_url,
              bannerImageURL: res2.data.secure_url,
              userName: values.collectionName,
              collectionAddress: address,
              folder: "profile",
              userwalletAddress: account?.address,
            },
          });
          props.setMsg(res.status === 200 ? "successfull!!" : "Try again!!");
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
        <Grid container spacing={0}>
          <Grid item xs={2}></Grid>
          <Grid item xs={8} alignSelf="center" textAlign={"center"}>
            <label htmlFor="logoImage">
              <Typography variant="body2">
                This image will also be used for navigation. 350 x 350
                recommended.
              </Typography>
              <br />
              {image["logoImage"] && (
                <Stack alignItems="center">
                  <Avatar
                    alt="Remy Sharp"
                    src={image["logoImage"]}
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
                name="logoImage"
                value={formik.values.logoImage}
                onChange={(e) => {
                  handleOnChange(e, "logoImage");
                }}
                accept="image/*"
                id="logoImage"
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
                  Upload logo image
                </Typography>
              </Button>
            </label>
            <br />
            <br />
            <label htmlFor="featuredImage">
              <Typography variant="body2">
                This image will be used for featuring your collection on the
                homepage, category pages, or other promotional areas of OpenSea.
                600 x 400 recommended.
              </Typography>
              <br />
              {image["featuredImage"] && (
                <Stack alignItems="center">
                  <Avatar
                    alt="Remy Sharp"
                    src={image["featuredImage"]}
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
                name="featuredImage"
                value={formik.values.featuredImage}
                onChange={(e) => {
                  handleOnChange(e, "featuredImage");
                }}
                accept="image/*"
                id="featuredImage"
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
                  Upload featured image
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
                  Upload banner image
                </Typography>
              </Button>
            </label>
            <br />
            <br />

            <br />
            <Box>
              <TextField
                sx={{ marginBottom: "30px" }}
                id="collectionName"
                name="collectionName"
                label="Collection Name"
                variant="outlined"
                fullWidth
                value={formik.values.collectionName}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
              {formik.touched.collectionName && formik.errors.collectionName ? (
                <Typography color="red" variant="body2">
                  {formik.errors.collectionName}
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
              formik.errors.collectionName !== undefined ||
              image["featuredImage"] ===
                "/db5dbf90c8c83d650e1022220b4d707e.jpg" ||
              image["logoImage"] ===
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