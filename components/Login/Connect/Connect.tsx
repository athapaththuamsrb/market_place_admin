import { useConnect, useDisconnect } from "wagmi";
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
    activeConnector,
    connect,
    connectors,
    error,
    isConnecting,
    pendingConnector,
  } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <Box>
      {/* <Typography
        variant="h3"
        gutterBottom
        component="div"
        sx={{
          flexGrow: 1,
          textAlign: "center",
          p: 5,
        }}
      >
        Connect your wallet
      </Typography> */}
      <Title firstWord="Connect" secondWord="your wallet" />
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
        Connect with your Metamask wallet. <br />If you don't have one, you can
        select the provider and create a new one.
      </Typography>
      <Container maxWidth="sm">
        <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
          <List
            component="nav"
            aria-label="main mailbox folders"
            sx={{ borderColor: "primary.main" }}
          >
            {isMounted &&
              connectors
                .filter((x) => x.ready && x.id !== activeConnector?.id)
                .map((x) => (
                  <ListItemButton
                    key={x.id}
                    onClick={(event) => connect(x)}
                    sx={{
                      backgroundColor:"#fafafa",
                      borderRadius: "16px",
                      borderColor: "primary.main",
                    }}
                  >
                    <ListItemIcon>
                      <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary={x.name} />
                  </ListItemButton>
                ))}
          </List>
        </Box>
      </Container>
      {/* {error && <div>{error.message}</div>} */}
    </Box>
  );
}
