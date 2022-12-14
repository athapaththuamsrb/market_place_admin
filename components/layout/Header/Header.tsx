import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import { useTheme } from "@mui/material/styles";
import SearchBar from "./Search";
import Link from "@mui/material/Link";
import Image from "next/image";
import Button from "@mui/material/Button";
import RenderMobileMenu from "./RenderMobileMenu";
import { useConnect, useDisconnect, useAccount } from "wagmi";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";
import { useGetMyOffers } from "../../hooks/useHook";

import React, {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  FC,
  SyntheticEvent,
} from "react";
import { useIsMounted, useGetMyProfile } from "../../hooks";
import { useRouter } from "next/router";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Logout from "@mui/icons-material/Logout";
import ConnectPopup from "./../../Popup/ConnectPopup";
import axios from "axios";
const Navbar: FC = () => {
  const { connect, connectors, activeConnector } = useConnect();
  const { data: ethereumAccount } = useAccount();
  const { disconnect } = useDisconnect();
  const theme = useTheme();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openConnect, setOpenConnect] = useState(false);
  const { offers, isPendingOffers, errorOffers } = useGetMyOffers();
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);
  const { profile, isPendingProfile, errorProfile, isAdmin, isSuperAdmin } =
    useGetMyProfile();
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [anchorE2, setAnchorE2] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorE2);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorE2(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorE2(null);
  };
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };
  const anchorRef = useRef();
  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  console.log(router.pathname);
  const revalidate = async () => {
    console.log(router.pathname);
    await axios.post("/api/revalidate", { data: { url: router.pathname } });
    router.reload();
  };
  const menuId = "primary-search-account-menu";
  const mobileMenuId = "primary-search-account-menu-mobile";
  const isMounted = useIsMounted();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ backgroundColor: "white" }}>
          <Link href="/" underline="none">
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                p: 0,
                m: 1,
                bgcolor: "background.paper",
                borderRadius: 1,
                flexShrink: 0,
              }}
            >
              <Image
                height={50}
                width={50}
                src={"/exclusives_new_logo.ico"}
                alt={"logo"}
                loading="lazy"
                layout="fixed"
              />

              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  display: { xs: "none", sm: "block" },
                  color: theme.palette.primary.main,
                  marginY: "auto",
                }}
              >
                Exclusives
              </Typography>
            </Box>
          </Link>
          <SearchBar />
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <Button
              size="small"
              color="primary"
              variant="outlined"
              sx={{ marginX: 1 }}
              onClick={() => revalidate()}
            >
              <Typography
                color="black"
                variant="h6"
                sx={{ fontWeight: 500, fontSize: "medium" }}
              >
                Revalidate
              </Typography>
            </Button>
            {isAdmin && (
              <Button
                size="small"
                color="primary"
                variant="outlined"
                href="/admin"
                sx={{ marginX: 1 }}
              >
                <Typography
                  color="black"
                  variant="h6"
                  sx={{ fontWeight: 500, fontSize: "medium" }}
                >
                  Admin Dashboard
                </Typography>
              </Button>
            )}
            <Button
              href="/explore-collections"
              size="small"
              color="primary"
              variant="outlined"
              sx={{ marginX: 1 }}
            >
              <Typography
                color="black"
                variant="h6"
                sx={{ fontWeight: 500, fontSize: "medium" }}
              >
                Explore
              </Typography>
            </Button>
            <Button
              href="/create"
              type="submit"
              size="small"
              color="secondary"
              variant="contained"
              sx={{ marginX: 1 }}
            >
              <Typography
                color="white"
                variant="h6"
                sx={{ fontWeight: 500, fontSize: "medium" }}
              >
                Create
              </Typography>
            </Button>
            {isMounted && connectors[0].ready && !ethereumAccount && (
              <Button
                onClick={() => setOpenConnect(true)}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ marginX: 1 }}
              >
                <Typography
                  color="black"
                  variant="h6"
                  sx={{ fontWeight: 500, fontSize: "medium" }}
                >
                  Connect Metamask
                </Typography>
              </Button>
            )}
            {isMounted && ethereumAccount && (
              <div>
                <Button
                  href={"/../account/view-offers"}
                  //onClick={handleClickNotification}
                >
                  <Badge
                    color="secondary"
                    badgeContent={offers.length}
                    max={99}
                  >
                    <NotificationsIcon color="action" />
                  </Badge>
                </Button>
                <Button
                  id="demo-positioned-button"
                  aria-controls={open ? "demo-positioned-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                >
                  <AccountCircleOutlinedIcon color="action" />
                </Button>
                <Menu
                  id="demo-positioned-menu"
                  aria-labelledby="demo-positioned-button"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  sx={{ my: 5 }}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <MenuItem onClick={handleClose}>
                    <AccountCircleOutlinedIcon sx={{ marginRight: 1 }} />
                    <Link href={"/account"} underline="none" variant="button">
                      Profile
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <CollectionsBookmarkIcon sx={{ marginRight: 1 }} />
                    <Link
                      href={"/account/collection"}
                      underline="none"
                      variant="button"
                    >
                      My Collection
                    </Link>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      disconnect();
                      handleClose();
                    }}
                  >
                    <Logout sx={{ marginRight: 1 }} />
                    <Link underline="none" variant="button">
                      Disconnect
                    </Link>
                  </MenuItem>
                </Menu>
              </div>
            )}
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              edge="start"
              sx={{ mr: 2, color: "black" }}
            >
              <MenuIcon />
            </IconButton>
            <RenderMobileMenu
              isMobileMenuOpen={isMobileMenuOpen}
              mobileMenuId={mobileMenuId}
              isMounted={isMounted}
              handleMobileMenuClose={handleMobileMenuClose}
              mobileMoreAnchorEl={mobileMoreAnchorEl}
              connectors={connectors}
              ethereumAccount={ethereumAccount}
              connect={connect}
              isAdmin={isAdmin}
              disconnect={disconnect}
              handleClose={handleClose}
            />
          </Box>
        </Toolbar>
      </AppBar>
      <ConnectPopup
        setOpenConnect={setOpenConnect}
        openConnect={openConnect}
      ></ConnectPopup>
    </Box>
  );
};
export default Navbar;
