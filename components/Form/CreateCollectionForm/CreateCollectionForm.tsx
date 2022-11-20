import React, { FC, SyntheticEvent, useState } from "react";
import { useFormik } from "formik";
import {
  Button,
  styled,
  Typography,
  TextField,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Avatar,
  Stack,
  Box,
  Grid,
  Card,
  CardMedia,
} from "@mui/material";
import axios from "axios";
import theme from "../../../src/theme";
import ModalPopUp from "../../Popup/Modal";
import { useSigner, useContract, useAccount, useConnect } from "wagmi";
import * as Yup from "yup";
import FactoryAddress from "../../../contractsData/Factory-address.json";
import FactoryAbi from "../../../contractsData/Factory.json";
import authService from "../../../services/auth.service";

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
  const { data: signer, isError, isLoading } = useSigner(); //TODO data is useSigner attibute we assign that value to signer
  const factory_ = useContract({
    //TODO create connection with Factory
    addressOrName: FactoryAddress.address,
    contractInterface: FactoryAbi.abi,
    signerOrProvider: signer,
  });
  const { data: account } = useAccount();
  const [image, setImage] = useState<{
    logoImage: string;
    bannerImage: string;
    featuredImage: string;
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
  const handleOnChange = async (
    e: React.FormEvent<HTMLInputElement | HTMLInputElement>,
    key: string
  ) => {
    const target = e.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    switch (key) {
      case "logoImage":
        const formDataLogo = new FormData();
        formDataLogo.append("file", file);
        formDataLogo.append("upload_preset", "my-upload-collection");
        const res1 = await axios.post(
          "https://api.cloudinary.com/v1_1/dtrrkeb4a/image/upload",
          formDataLogo
        );
        setImage({ ...image, logoImage: res1.data.secure_url });
        break;
      case "bannerImage":
        const formDataBanner = new FormData();
        formDataBanner.append("file", file);
        formDataBanner.append("upload_preset", "my-upload-collection");
        const res2 = await axios.post(
          "https://api.cloudinary.com/v1_1/dtrrkeb4a/image/upload",
          formDataBanner
        );
        setImage({ ...image, bannerImage: res2.data.secure_url });
        break;
      case "featuredImage":
        const formDataFeatured = new FormData();
        formDataFeatured.append("file", file);
        formDataFeatured.append("upload_preset", "my-upload-collection");
        const res3 = await axios.post(
          "https://api.cloudinary.com/v1_1/dtrrkeb4a/image/upload",
          formDataFeatured
        );
        setImage({ ...image, featuredImage: res3.data.secure_url });
        break;
    }
  };

  const formik = useFormik({
    initialValues: {
      collectionName: "",
      collectionDescription: "",
      collectionCategory: "",
      featuredImage: "",
      bannerImage: "",
      logoImage: "",
    },
    validationSchema: Yup.object({
      collectionName: Yup.string()
        .trim()
        .min(5, "Give more than 5")
        .max(100, "can't exit  more than 20")
        .required("Required"),
      collectionDescription: Yup.string()
        .trim()
        .min(5, "Give more than 5")
        .max(1000, "can't exit  more than 500")
        .required("Required"),
      collectionCategory: Yup.mixed()
        .oneOf([
          "Nature",
          "Photography",
          "Art",
          "Worlds",
          "Virtual",
          "Utility",
          "Cards",
          "Sports",
          "Music",
          "Collectibles",
        ])
        .required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        if (
          image["featuredImage"] !== "/db5dbf90c8c83d650e1022220b4d707e.jpg" &&
          image["logoImage"] !==
            "/default-avatar-profile-icon-vector-default-avatar-profile-icon-vector-social-media-user-image-vector-illustration-227787227.jpg" &&
          image["bannerImage"] !== "/db5dbf90c8c83d650e1022220b4d707e.jpg"
        ) {
          props.setMsg("processing.....");
          //======================================================
          const smartContract = await factory_.createNewCollection(
            values.collectionName
          );
          const output = await smartContract.wait();
          // console.log(output);
          // console.log(output.logs[0].address);
          //======================================================
          const address = output.logs[0].address;
          // console.log("res");
          const res = await axios.post("/api/uploadFile", {
            data: {
              featuredImageURL: image["featuredImage"],
              logoImageURL: image["logoImage"],
              bannerImageURL: image["bannerImage"],
              collectionName: values.collectionName,
              collectionDescription: values.collectionDescription,
              collectionAddress: address,
              collectionCategory: values.collectionCategory,
              folder: "collection",
              token: authService.getUserToken(),
            },
          });
          // console.log(res);
          props.setMsg(res.status === 201 ? "Successful!" : "Try again!!");
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
    <Box
      sx={{
        flexGrow: 1,
        [theme.breakpoints.up("md")]: {
          width: "60%",
        },
        [theme.breakpoints.down("md")]: {
          width: "80%",
        },
        marginX: "auto",
      }}
    >
      <form onSubmit={formik.handleSubmit}>
        <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            alignSelf="center"
            textAlign={"center"}
          >
            <label htmlFor="logoImage">
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
                disabled={props.msg === "processing....."}
                accept="image/*"
                id="logoImage"
                multiple
                type="file"
              />
              <Button
                component="span"
                size="medium"
                disabled={props.msg === "processing....."}
                color="secondary"
                variant="contained"
              >
                <Typography color="white" variant="h6" sx={{ fontWeight: 500 }}>
                  Upload logo image
                </Typography>
              </Button>
              <Typography variant="h6" sx={{ fontSize: 13, marginTop: 0.5 }}>
                This image will also be used for navigation. 350 x 350
                recommended.
              </Typography>
              <br />
            </label>

            <label htmlFor="featuredImage">
              {image["featuredImage"] && (
                // <Stack alignItems="center">
                //   <Avatar
                //     alt="Remy Sharp"
                //     src={image["featuredImage"]}
                //     sx={{
                //       width: 500,
                //       height: 200,
                //       boxShadow: 3,
                //     }}
                //     variant="square"
                //   />
                // </Stack>
                <Card sx={{ display: "flex", boxShadow: 0, borderRadius: 5 }}>
                  <CardMedia
                    component="img"
                    // height="400"
                    // width="400"
                    image={image["featuredImage"]}
                    alt="avatar"
                    sx={{
                      //maxWidth: 600,
                      height: 300,
                      borderRadius: 5,
                      boxShadow: 3,
                    }}
                  />
                </Card>
              )}
              <br />
              <Input
                name="featuredImage"
                value={formik.values.featuredImage}
                onChange={(e) => {
                  handleOnChange(e, "featuredImage");
                }}
                disabled={props.msg === "processing....."}
                accept="image/*"
                id="featuredImage"
                multiple
                type="file"
              />
              <Button
                component="span"
                size="medium"
                disabled={props.msg === "processing....."}
                color="secondary"
                variant="contained"
              >
                <Typography color="white" variant="h6" sx={{ fontWeight: 500 }}>
                  Upload featured image
                </Typography>
              </Button>
              <Typography variant="h6" sx={{ fontSize: 13, marginTop: 0.5 }}>
                This image will be used for featuring your collection on the
                homepage, category pages. 600 x 400 recommended.
              </Typography>
            </label>

            <label htmlFor="bannerImage">
              <br />
              {image["bannerImage"] && (
                // <Stack alignItems="center">
                //   <Avatar
                //     alt="Remy Sharp"
                //     src={image["bannerImage"]}
                //     sx={{
                //       width: 500,
                //       height: 200,
                //       boxShadow: 3,
                //     }}
                //     variant="square"
                //   />
                // </Stack>
                <Card sx={{ display: "flex", boxShadow: 0, borderRadius: 5 }}>
                  <CardMedia
                    component="img"
                    // height="400"
                    // width="400"
                    image={image["bannerImage"]}
                    alt="avatar"
                    sx={{
                      //maxWidth: 600,
                      height: 400,
                      borderRadius: 5,
                      boxShadow: 3,
                    }}
                  />
                </Card>
              )}
              <br />
              <Input
                name="bannerImage"
                value={formik.values.bannerImage}
                onChange={(e) => {
                  handleOnChange(e, "bannerImage");
                }}
                disabled={props.msg === "processing....."}
                accept="image/*"
                id="bannerImage"
                multiple
                type="file"
              />
              <Button
                component="span"
                size="medium"
                disabled={props.msg === "processing....."}
                color="secondary"
                variant="contained"
              >
                <Typography color="white" variant="h6" sx={{ fontWeight: 500 }}>
                  Upload banner image
                </Typography>
              </Button>
              <Typography variant="h6" sx={{ fontSize: 13, marginTop: 0.5 }}>
                This image will appear at the top of your collection page. 2000
                x 350 recommended.
              </Typography>
            </label>
            <br />
            <br />
            <Box>
              <TextField
                sx={{ marginBottom: "30px" }}
                id="collectionName"
                name="collectionName"
                label="Collection Name"
                disabled={props.msg === "processing....."}
                variant="outlined"
                fullWidth
                required
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
            <Box>
              <TextField
                sx={{ marginBottom: "30px" }}
                id="collectionDescription"
                name="collectionDescription"
                label="Description"
                disabled={props.msg === "processing....."}
                variant="outlined"
                multiline
                fullWidth
                required
                value={formik.values.collectionDescription}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                rows={4}
              />
              {formik.touched.collectionDescription &&
              formik.errors.collectionDescription ? (
                <Typography color="red" variant="body2">
                  {formik.errors.collectionDescription}{" "}
                </Typography>
              ) : null}
            </Box>
            <Box>
              <FormControl fullWidth sx={{ marginBottom: "30px" }}>
                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="collectionCategory"
                  name="collectionCategory"
                  value={formik.values.collectionCategory}
                  label="Category"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                >
                  <MenuItem value={"Art"}>Art</MenuItem>
                  <MenuItem value={"Collectibles"}>Collectibles</MenuItem>
                  <MenuItem value={"Music"}>Music</MenuItem>
                  <MenuItem value={"Photography"}>Photography</MenuItem>
                  <MenuItem value={"Sports"}>Sports</MenuItem>
                  <MenuItem value={"Cards"}>Cards</MenuItem>
                  <MenuItem value={"Nature"}>Nature</MenuItem>
                  <MenuItem value={"Utility"}>Utility</MenuItem>
                  <MenuItem value={"Virtual"}>Virtual</MenuItem>
                  <MenuItem value={"Worlds"}>Worlds</MenuItem>
                </Select>
              </FormControl>
              {formik.touched.collectionCategory &&
              formik.errors.collectionCategory ? (
                <Typography color="red" variant="body2">
                  {formik.errors.collectionCategory}
                </Typography>
              ) : null}
            </Box>
          </Grid>
        </Grid>
        <Box textAlign={"center"} sx={{ marginBottom: "60px" }}>
          <Button
            type="submit"
            disabled={
              formik.errors.collectionName === "" ||
              formik.errors.collectionDescription === "" ||
              formik.errors.collectionCategory === "" ||
              image["featuredImage"] ===
                "/db5dbf90c8c83d650e1022220b4d707e.jpg" ||
              image["logoImage"] ===
                "/default-avatar-profile-icon-vector-default-avatar-profile-icon-vector-social-media-user-image-vector-illustration-227787227.jpg" ||
              image["bannerImage"] ===
                "/db5dbf90c8c83d650e1022220b4d707e.jpg" ||
              props.msg === "processing....."
                ? true
                : false
            }
            size="large"
            color="secondary"
            variant="contained"
          >
            <Typography variant="h3" color="white" sx={{ fontSize: 30 }}>
              Create Collection
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
