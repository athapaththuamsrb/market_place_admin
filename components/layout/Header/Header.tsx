import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import { useTheme } from "@mui/material/styles";
import SearchBar from "./Search";
import Link from "next/link";
import Image from "next/image";
import Button from "@mui/material/Button";
import RenderMobileMenu from "./RenderMobileMenu";
import { useConnect, useDisconnect, useAccount } from "wagmi";
import { useState, useRef } from "react";
import { useIsMounted, useGetMyProfile } from "../../hooks";
import { useRouter } from "next/router";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Logout from "@mui/icons-material/Logout";

export default function Navbar() {
  const { connect, connectors } = useConnect();
  const { data: ethereumAccount } = useAccount();
  const { disconnect } = useDisconnect();
  const theme = useTheme();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const { profile, isPendingProfile, errorProfile } = useGetMyProfile();
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [anchorE2, setAnchorE2] = React.useState<null | HTMLElement>(null);
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
  // const handleMenuClose = () => {
  //   setAnchorEl(null);
  //   handleMobileMenuClose();
  // };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const mobileMenuId = "primary-search-account-menu-mobile";

  //wagmi
  const isMounted = useIsMounted();

  //console.log(connectors[0].ready);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ backgroundColor: "white" }}>
          <Link href="/">
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                p: 1,
                m: 1,
                bgcolor: "background.paper",
                borderRadius: 1,
                flexShrink: 0,
              }}
            >
              <Box marginRight="5px">
                <Image
                  height={30}
                  width={30}
                  src={"/logo-background.png"}
                  alt={"logo"}
                  loading="lazy"
                />
              </Box>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  display: { xs: "none", sm: "block" },
                  color: theme.palette.primary.main,
                }}
              >
                Exclusives
              </Typography>
            </Box>
          </Link>
          <SearchBar />
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {(profile?.type === "ADMIN" || profile?.type === "SUPER_ADMIN") && (
              <Button
                variant="outlined"
                href="/explore-collections"
                sx={{ mx: 1 }}
              >
                Admin Dashboard
              </Button>
            )}
            <Button
              variant="outlined"
              href="/explore-collections"
              sx={{ mx: 1 }}
            >
              Explore
            </Button>
            <Button
              variant="contained"
              href="/create"
              sx={{
                mx: 1,
                color: "white",
                backgroundColor: "#CA82FF",
                borderColor:"#CA82FF",
              }}
            >
              Create
            </Button>
            {/* MetaMask Connect */}
            {isMounted && connectors[0].ready && !ethereumAccount && (
              <Button variant="outlined" onClick={() => connect(connectors[0])}>
                Connect Metamask
              </Button>
            )}
            {isMounted && ethereumAccount && (
              <div>
                <Button
                  id="demo-positioned-button"
                  aria-controls={open ? "demo-positioned-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                >
                  <AccountCircleOutlinedIcon />
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
                    <AccountCircleOutlinedIcon />
                    <Link href={"/account"}>Profile</Link>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <CollectionsBookmarkIcon />
                    <Link href={"/account/collection"}>My Collection</Link>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      disconnect();
                      handleClose();
                    }}
                  >
                    <Logout />
                    Disconnect
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
          </Box>
        </Toolbar>
      </AppBar>
      {/* <RenderMobileMenu
        isMobileMenuOpen={isMobileMenuOpen}
        mobileMenuId={mobileMenuId}
        isMounted={isMounted}
        activeConnector={activeConnector}
        connect={connect}
        connectors={connectors}
        isConnecting={isConnecting}
        disconnect={disconnect}
        pendingConnector={pendingConnector}
        handleMobileMenuClose={handleMobileMenuClose}
        mobileMoreAnchorEl={mobileMoreAnchorEl}
      /> */}
    </Box>
  );
}
