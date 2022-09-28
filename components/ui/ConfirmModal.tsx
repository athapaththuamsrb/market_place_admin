import { Button, Typography, Avatar, Stack } from "@mui/material";
import { FC } from "react";
import Dialog from "@mui/material/Dialog";
import Title from "./Title";
import { Box } from "@mui/system";
import { SalesOrder } from "../../src/interfaces";
import { useSignTypedData } from "wagmi";
import MarketplaceAddress from "../../contractsData/Marketplace-address.json";
import axios from "axios";
import ModalPopUp from "../Modal";
import { ethers } from "ethers";

interface ConfirmModalProps {
  openModal: boolean;
  setOpenModal: (modalOpen: boolean) => void;
  salesOrder: SalesOrder;
  setSalesOrder: (salesOrder: SalesOrder) => void;
  image: string;
  setMsg: (msg: string) => void;
  open: boolean;
  msg: string;
  setOpen: (open: boolean) => void;
}

const ConfirmModal: FC<ConfirmModalProps> = (props) => {
  const domain = {
    name: "Lazy Marketplace",
    version: "1.0",
    chainId: 5, //TODO Rinkeby => 4, Local network=>1337,Goerli=>5
    verifyingContract: MarketplaceAddress.address,
  };
  // The named list of all type definitions
  const types = {
    SignedNFTData: [
      { name: "tokenID", type: "uint256" },
      { name: "price", type: "uint256" },
      { name: "uri", type: "string" },
      { name: "creator", type: "address" },
      { name: "category", type: "string" },
      { name: "collection", type: "address" },
      { name: "royality", type: "uint256" },
    ],
  };

  const { signTypedDataAsync } = useSignTypedData();
  const handleClose = () => {
    props.setOpenModal(false);
  };
  //TODO  SIGNATURE IS VALIDATION AND UNIQCK VALUE TO THE NFT

  const addDB = async () => {
    console.log(props.salesOrder);
    const signature = await signTypedDataAsync({
      domain,
      types,
      value: {
        tokenID: props.salesOrder.nftData.tokenID,
        uri: props.salesOrder.nftData.uri,
        creator: props.salesOrder.nftData.creator,
        category: props.salesOrder.nftData.category,
        collection: props.salesOrder.nftData.collection,
        royality: 0,
        price: ethers.utils.parseEther("0"), //TODO PRICE
      },
    });
    const newSalesOrder = { ...props.salesOrder, signature };
    props.setSalesOrder(newSalesOrder);
    //console.log(newSalesOrder);
    props.setMsg("processing.....");
    props.setOpenModal(false); //TODO THIS IS OPEN WOLLET TO GET CONFORMATION IS THIS CORRECT
    try {
      const res1 = await axios.post("api/createNFT", {
        ...newSalesOrder,
      });
      props.setMsg(res1.status === 201 ? "successfull!!" : "Try again!!");
      props.setOpen(true);
    } catch (error) {
      props.setOpen(true);
      props.setMsg("Try again!!");
    }
  };
  return (
    <div>
      <div>
        <Dialog
          fullWidth
          maxWidth="lg"
          open={props.openModal}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Title firstWord="Confirm" secondWord="Listing" />
          <Stack alignItems="center">
            <Avatar
              alt="Remy Sharp"
              src={props.image}
              sx={{
                width: 400,
                height: 400,
                boxShadow: 3,
              }}
              variant="square"
            />
          </Stack>
          <br />
          <br />
          <Typography sx={{ marginBottom: "20px" }} align="center" variant="h3">
            item Name : {props.salesOrder.name}
          </Typography>
          {/* <Typography sx={{ marginBottom: "20px" }} align="center" variant="h3">
            {`item Price : ${props.salesOrder.nftData.price} ETH`}
          </Typography> */}
          <Typography sx={{ marginBottom: "20px" }} align="center" variant="h3">
            Creator Fee : 0%
          </Typography>
          <Typography sx={{ marginBottom: "70px" }} align="center" variant="h3">
            {`Total Price : ${props.salesOrder.nftData.price} ETH`}
          </Typography>
          <Box textAlign={"center"}>
            <Button
              onClick={addDB}
              sx={{ width: "20%", marginBottom: "70px" }}
              size="medium"
              color="secondary"
              variant="contained"
            >
              <Typography color="white" variant="h2">
                Create NFT
              </Typography>
            </Button>
          </Box>
        </Dialog>
      </div>
      <ModalPopUp
        msg={props.msg}
        open={props.open}
        setOpen={props.setOpen}
        setMsg={props.setMsg}
      />
    </div>
  );
};

export default ConfirmModal;