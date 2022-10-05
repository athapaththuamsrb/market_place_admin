import Title from "../../../../components/ui/Title";
import { useDisconnect, useConnect } from "wagmi";
import { Typography } from "@mui/material";
import CreateCollectionForm from "../../../../components/Form/CreateCollectionForm";
import { useEffect, useState } from "react";
import { SalesOrder } from "../../../../src/interfaces";
import { useIsMounted } from "../../../../components/hooks";
import Connect from "../../../../components/Login/Connect";
import type { NextPage } from "next";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";

const CreatePage: NextPage = (props) => {
  const isMounted = useIsMounted();
  const {
    activeConnector,
    connect,
    connectors,
    error,
    isConnecting,
    pendingConnector,
  } = useConnect();
  const { disconnect } = useDisconnect();
  const [openModal, setOpenModal] = useState(false);
  const [ipfsImage, setIpfsImage] = useState<string>("");
  const [msg, setMsg] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [salesOrder, setSalesOrder] = useState<SalesOrder>({
    nftData: {
      tokenID: 0,
      price: "0",
      creator: "",
      uri: "",
      category: "",
      collection: "",
    },
    signature: "",
    sold: false,
    name: "",
    description: "",
    image: "",
    royality: 0,
  });

  return isMounted && activeConnector ? (
    <div>
      <Title firstWord="Create" secondWord="Collection" />
      {msg === "processing....." && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      )}
      <br />
      <br />
      <CreateCollectionForm
        setMsg={setMsg}
        open={open}
        msg={msg}
        setOpen={setOpen}
      />
    </div>
  ) : (
    <Connect />
  );
};
export default CreatePage;
