import React, { FC, SyntheticEvent, useEffect, useState } from "react";
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
  FormControlLabel,
  Checkbox,
  FormGroup,
  Box,
  Grid,
} from "@mui/material";
import Image from "next/image";
import { useSigner, useContract } from "wagmi";
import { create as ipfsHttpClient } from "ipfs-http-client";
import ConfirmModal from "../../ui/ConfirmModal";
import { NFT, SalesOrder } from "../../../src/interfaces";
import * as Yup from "yup";
import { useGetMyCollectionItem } from "../../../components/hooks";
import LinearProgress from "@mui/material/LinearProgress";
import { useRouter } from "next/router";
const projectId = "2DI7xsXof3jkeXnqqBcZ4QmiLmW"; // <---------- your Infura Project ID

const projectSecret = "13f77964b78b57d2159a682b364cf50d"; // <---------- your Infura Secret
// (for security concerns, consider saving these values in .env files)

const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");
const client = ipfsHttpClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

type CreateFormProps = {
  setOpenModal: (openModal: boolean) => void;
  setSalesOrder: (salesOrder: SalesOrder) => void;
  ipfsImage: string;
  setIpfsImage: (image: string) => void;
  salesOrder: SalesOrder;
  openModal: boolean;
  setMsg: (msg: string) => void;
  open: boolean;
  msg: string;
  setOpen: (open: boolean) => void;
};

const Input = styled("input")({
  display: "none",
});

const CreateForm: FC<CreateFormProps> = (props) => {
  const [image, setImage] = useState(null);
  const [createObjectURL, setCreateObjectURL] = useState(null);
  const { collectionItem, isPendingCollectionItem, errorCollectionItem } =
    useGetMyCollectionItem();
  const { data: signer, isError, isLoading } = useSigner();
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      collection: "",
      royality: 0,
    },
    validationSchema: Yup.object({
      name: Yup.string().trim().required("Required"),
      description: Yup.string().trim().required("Required"),
      collection: Yup.string().length(42, "exact size").required("Required"),
      royality: Yup.number()
        .required("required field")
        .positive()
        .integer()
        .max(100, "maximum value is 100%")
        .min(0, "minimum value is 0%"),
    }),
    onSubmit: async (values) => {
      const selectedCollection = collectionItem.map((collectionData) => {
        if (values.collection === collectionData.collectionAddress) {
          return collectionData.category;
        }
      });
      console.log(selectedCollection);
      const withIpfs = {
        ...values,
        image: props.ipfsImage,
        category: selectedCollection[0],
      };

      try {
        const result = await client.add(
          JSON.stringify({
            name: withIpfs.name,
            description: withIpfs.description,
            category: withIpfs.category,
            collection: withIpfs.collection,
            image: withIpfs.image,
            creator: await signer?.getAddress(),
            royalty: withIpfs.royality,
          })
        );
        const uri = `https://exclusives.infura-ipfs.io/ipfs/${result.path}`;
        // let tokenId = await nftCollection1_._tokenIdCounter();
        // tokenId = tokenId.toNumber();
        const creator = await signer?.getAddress();
        if (creator === undefined) {
          throw new Error("Crator address is undefine");
        }
        if (withIpfs.category === undefined) {
          throw new Error("Category is undefine");
        }
        const nftData: NFT = {
          tokenID: 0,
          price: "0",
          uri: uri,
          creator: creator,
          category: withIpfs.category,
          collection: withIpfs.collection,
        };
        await props.setSalesOrder({
          nftData: nftData,
          signature: "",
          sold: false,
          name: withIpfs.name,
          description: withIpfs.description,
          image: withIpfs.image,
          royality: isRoyality ? values.royality : 0,
        });
      } catch (error) {
        console.log("ipfs uri upload error: ", error);
      }
    },
  });
  //TODO THIS IS USE FOR SHOW NFT IMAGE IN CONFIRM MODAL
  const uploadToIPFS = async (event: SyntheticEvent) => {
    event.preventDefault();
    const file = (event.target as HTMLFormElement).files[0];
    if (typeof file !== "undefined") {
      try {
        const result = await client.add(file);
        console.log(
          "result" + `https://exclusives.infura-ipfs.io/ipfs/${result.path}`
        );
        props.setIpfsImage(
          `https://exclusives.infura-ipfs.io/ipfs/${result.path}`
        );
      } catch (error) {
        console.table(["ipfs image upload error: ", error]);
      }
    }
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsRoyality(event.target.checked);
  };
  const [isRoyality, setIsRoyality] = useState(false);
  useEffect(() => {
    if (isPendingCollectionItem === false && collectionItem.length === 0) {
      router.push(`${router.basePath}/account/collection/create`);
    }
  }, [collectionItem.length, isPendingCollectionItem, router]);

  return !isPendingCollectionItem ? (
    <Box sx={{ flexGrow: 1, width: "70%", marginX: "auto" }}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={0}>
          <Grid item xs={6} alignSelf="center" textAlign={"center"}>
            <label htmlFor="image">
              <Stack alignItems="center">
                <Avatar
                  alt="Remy Sharp"
                  src={props.ipfsImage}
                  sx={{
                    width: 400,
                    height: 400,
                    boxShadow: 3,
                  }}
                  variant="square"
                />
              </Stack>
              <br />
              <Box>
                <Input
                  name="image"
                  onChange={uploadToIPFS}
                  accept="image/*"
                  id="image"
                  multiple
                  type="file"
                />
              </Box>
              <Button
                component="span"
                size="large"
                color="secondary"
                variant="contained"
              >
                <Typography color="white" variant="h3">
                  Upload File
                </Typography>
              </Button>
            </label>
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={5}>
            <Box>
              <TextField
                sx={{ marginBottom: "30px" }}
                id="name"
                name="name"
                label="Name"
                variant="outlined"
                fullWidth
                value={formik.values.name}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
              {formik.touched.name && formik.errors.name ? (
                <Typography color="red" variant="body2">
                  {formik.errors.name}
                </Typography>
              ) : null}
            </Box>
            <Box>
              <TextField
                sx={{ marginBottom: "30px" }}
                label="Description"
                variant="outlined"
                fullWidth
                id="description"
                name="description"
                value={formik.values.description}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
              {formik.touched.description && formik.errors.description ? (
                <Typography color="red" variant="body2">
                  {formik.errors.description}
                </Typography>
              ) : null}
            </Box>

            <Box>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Collection
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="collection"
                  name="collection"
                  value={formik.values.collection}
                  label="Collection"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                >
                  {collectionItem &&
                    collectionItem.map((collectionCard) => {
                      return (
                        <MenuItem
                          value={collectionCard.collectionAddress}
                          key={collectionCard.collectionAddress}
                        >
                          {collectionCard.collectionName}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
              {formik.touched.collection && formik.errors.collection ? (
                <Typography color="red" variant="body2">
                  {formik.errors.collection}
                </Typography>
              ) : null}
            </Box>
            <Box>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox checked={isRoyality} onChange={handleChange} />
                  }
                  label="Do you need to get royality fee?"
                />
              </FormGroup>

              {isRoyality && (
                <TextField
                  sx={{ marginBottom: "30px" }}
                  id="royality"
                  label="royality"
                  variant="outlined"
                  fullWidth
                  name="royality"
                  value={formik.values.royality}
                  onChange={formik.handleChange}
                />
              )}
              {isRoyality &&
              formik.touched.royality &&
              formik.errors.royality ? (
                <Typography color="red" variant="body2">
                  {formik.errors.royality}
                </Typography>
              ) : null}
            </Box>
          </Grid>
        </Grid>
        <Box
          textAlign={"center"}
          sx={{
            marginBottom: "50px",
          }}
        >
          <Button
            type="submit"
            disabled={
              formik.errors.collection ||
              formik.errors.name ||
              formik.errors.description ||
              (isRoyality && formik.errors.royality) ||
              props.ipfsImage === "/db5dbf90c8c83d650e1022220b4d707e.jpg" ||
              props.msg === "processing....."
                ? true
                : false
            }
            onClick={() => {
              props.setOpenModal(true);
              props.setMsg("");
            }}
            style={{ borderWidth: "3px" }}
            sx={{ marginTop: "50px" }}
            size="large"
            color="secondary"
            variant="contained"
          >
            <Typography variant="h2" color="white" sx={{ fontSize: 30 }}>
              Create
            </Typography>
          </Button>
        </Box>
      </form>
      <ConfirmModal
        setSalesOrder={props.setSalesOrder}
        salesOrder={props.salesOrder}
        image={props.ipfsImage}
        setOpenModal={props.setOpenModal}
        openModal={props.openModal}
        setMsg={props.setMsg}
        open={props.open}
        msg={props.msg}
        setOpen={props.setOpen}
      />
    </Box>
  ) : (
    <Box sx={{ width: "100%" }}>
      <LinearProgress />
    </Box>
  );
};

export default CreateForm;
