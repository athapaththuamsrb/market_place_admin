import type { NextPage } from "next";
import EditProfileForm from "../../../components/Form/EditProfileForm";
import Title from "../../../components/ui/Title";
import { useDisconnect, useConnect } from "wagmi";
import { useState, useEffect } from "react";
import { SalesOrder } from "../../../src/interfaces";
import { useIsMounted } from "../../../components/hooks";
import Connect from "../../../components/Login/Connect";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
const Edit: NextPage = (props) => {
  const isMounted = useIsMounted();
  const { activeConnector } = useConnect();
  const { disconnect } = useDisconnect();
  const [openModal, setOpenModal] = useState(false);
  const [ipfsImage, setIpfsImage] = useState<string>("");
  const [msg, setMsg] = useState<string>("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
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
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".png"],
    },
  });
  useEffect(() => {
    if (!activeConnector) {
      router.push(`${router.basePath}/explore-collections`);
    }
  }, [activeConnector, router]);
  return isMounted && activeConnector ? (
    <div>
      <Title firstWord="Edit" secondWord="Profile" />
      {msg === "processing....." && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      )}
      <br />
      <br />
      <EditProfileForm
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
export default Edit;
