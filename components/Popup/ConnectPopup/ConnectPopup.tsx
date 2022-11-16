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
    <Dialog open={openConnect}>
      <DialogTitle
        sx={{
          backgroundColor: "#CA82FF",
          color: "white",
        }}
      >
        <div style={{ display: "flex" }}>
          <Title firstWord="Connect your wallet" secondWord="" />
          <IconButton
            onClick={() => {
              setOpenConnect(false);
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
            p: 5,
          }}
        >
          {error && <div>{error.message}</div>}
        </Typography>
      </Container>
    </Dialog>
  );
};
export default ConnectPopup;
