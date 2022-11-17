import { useConnect, useDisconnect, useAccount } from "wagmi";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Container from "@mui/material/Container";
import InboxIcon from "@mui/icons-material/Inbox";
import { useIsMounted } from "../../hooks";
import Title from "../../../components/ui/Title";

export default function Connect() {
  const isMounted = useIsMounted();
  const {
    connect,
    connectors,
    error,
    pendingConnector,
    activeConnector,
    isConnected,
  } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <Box>
      <Title firstWord="Connect" secondWord="your wallet" />
      <Typography
        variant="h6"
        gutterBottom
        component="div"
        sx={{
          flexGrow: 1,
          textAlign: "center",
          p: 1,
        }}
      >
        Connect with your Metamask wallet. <br />
        If you don{"'"}t have one, you can select the provider and create a new
        one.
      </Typography>
      <Container maxWidth="sm">
        <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
          <Typography
            variant="h6"
            gutterBottom
            component="div"
            sx={{
              flexGrow: 1,
              textAlign: "center",
              p: 1,
            }}
          >
            {isConnected && activeConnector && (
              <div>Connected to {activeConnector.name}</div>
            )}
          </Typography>

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
                    marginY: "30px",
                  }}
                >
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary={connector.name} />
                  {/* <ListItemText
                    primary={
                      isLoading &&
                      pendingConnector?.id === connector.id &&
                      " (connecting)"
                    }
                  /> */}
                </ListItemButton>
              ))}
          </List>
          <Typography
            variant="h6"
            gutterBottom
            component="div"
            color="red"
            sx={{
              flexGrow: 1,
              textAlign: "center",
              p: 3,
            }}
          >
            {error && <div>{error.message}</div>}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
