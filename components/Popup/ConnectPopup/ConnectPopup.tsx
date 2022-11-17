import { useConnect, useDisconnect, useAccount } from "wagmi";
import InboxIcon from "@mui/icons-material/Inbox";
import { useIsMounted } from "../../hooks";
import Title from "../../../components/ui/Title";
import { FC, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  IconButton,
  Button,
  Stack,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  Container,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type ConnectPopupProps = {
  openConnect: boolean;
  setOpenConnect: (openModal: boolean) => void;
};
const ConnectPopup: FC<ConnectPopupProps> = ({
  openConnect,
  setOpenConnect,
}) => {
  const isMounted = useIsMounted();
  const handleClose = () => {
    setOpenConnect(false);
  };
  const {
    connect,
    connectors,
    error,
    pendingConnector,
    activeConnector,
    isConnected,
  } = useConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (isConnected && activeConnector) {
      setOpenConnect(false);
    }
  }, [activeConnector, isConnected, setOpenConnect]);
  return (
    <Dialog open={openConnect} sx={{borderRadius:2}}>
      <DialogTitle
        sx={{
          backgroundColor: "#CA82FF",
          color: "white",
          boxShadow: 2,
          borderRadius: 0,
        }}
      >
        <div style={{ display: "flex" }}>
          <Typography
            variant="h5"
            component="div"
            style={{
              flexGrow: 1,
              fontWeight: 600,
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            Connect your wallet
          </Typography>
          {/* <Title firstWord="Connect your wallet" secondWord="" /> */}
          <IconButton
            onClick={() => {
              setOpenConnect(false);
            }}
            sx={{height:"30px", width:"30px", marginBottom:"20px", marginLeft:"20px", background:"#CA82df"}}
          >
            <CloseIcon
              sx={{
                color: "white",
                height:"20px"
              }}
            />
          </IconButton>
        </div>
      </DialogTitle>
      <Container maxWidth="sm">
        <List
          component="nav"
          aria-label="main mailbox folders"
          sx={{ borderColor: "primary.main" }}
        >
          {isMounted &&
            connectors.map((connector) => (
              <ListItemButton
                disabled={!connector.ready}
                key={connector.id}
                onClick={() => connect({ connector })}
                sx={{
                  backgroundColor: "#fafafa",
                  borderRadius: "16px",
                  marginY:"15px",
                  borderColor: "primary.main",
                }}
              >
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary={connector.name} />
              </ListItemButton>
            ))}
        </List>
        <Typography
          variant="h6"
          gutterBottom
          component="div"
          sx={{
            flexGrow: 1,
            textAlign: "center",
            p: 1,
            color:"red"
          }}
        >
          {error && <div>{error.message}</div>}
        </Typography>
      </Container>
    </Dialog>
  );
};
export default ConnectPopup;
