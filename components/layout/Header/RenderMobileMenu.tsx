import { MenuItem, Menu, ListItemText, Box, Button } from "@mui/material";
import Link from "@mui/material/Link";
import React, { FC, useState } from "react";
import { Connector } from "wagmi";
import { GetAccountResult } from "@wagmi/core";
import ConnectPopup from "../../Popup/ConnectPopup/ConnectPopup";
type RenderMobileMenuProps = {
  isMobileMenuOpen: boolean;
  mobileMenuId: string;
  isMounted: boolean;
  handleMobileMenuClose: () => void;
  mobileMoreAnchorEl: null | HTMLElement;
  connectors: Connector<any, any>[];
  ethereumAccount: any | undefined;
  connect: any;
  isAdmin: boolean;
  disconnect: any;
  handleClose: () => void;
};
const renderMobileMenu: FC<RenderMobileMenuProps> = ({
  isMobileMenuOpen,
  mobileMenuId,
  isMounted,
  handleMobileMenuClose,
  mobileMoreAnchorEl,
  connectors,
  ethereumAccount,
  connect,
  isAdmin,
  disconnect,
  handleClose,
}) => {
  const [openConnect, setOpenConnect] = useState(false);
  return (
    <Box>
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{ my: 5 }}
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
      >
        {isAdmin && (
          <MenuItem onClick={handleMobileMenuClose}>
            <Link href={"/admin"} underline="none" variant="button">
              Admin
            </Link>
          </MenuItem>
        )}
        <MenuItem onClick={handleMobileMenuClose}>
          <Link href={"/explore-collections"} underline="none" variant="button">
            Explore
          </Link>
        </MenuItem>
        <MenuItem onClick={handleMobileMenuClose}>
          <Link href={"/create"} underline="none" variant="button">
            Create
          </Link>
        </MenuItem>
        {isMounted && connectors[0].ready && !ethereumAccount && (
          <MenuItem onClick={() => connect(connectors[0])}>
            <Link
              component="button"
              onClick={() => setOpenConnect(true)}
              underline="none"
              variant="button"
            >
              Connect
            </Link>
          </MenuItem>
        )}
        {isMounted && ethereumAccount && (
          <div>
            <MenuItem onClick={handleMobileMenuClose}>
              <Link href={"/account"} underline="none" variant="button">
                Profile
              </Link>
            </MenuItem>
            <MenuItem onClick={handleMobileMenuClose}>
              <Link href={"/account/collection"} underline="none" variant="button">
                My Collection
              </Link>
            </MenuItem>
            <MenuItem onClick={handleMobileMenuClose}>
              <Link href={"/../account/view-offers"} underline="none" variant="button">
                My Offers
              </Link>
            </MenuItem>
            <MenuItem
              onClick={() => {
                disconnect();
                handleClose();
              }}
            >
              <Link href={""} underline="none" variant="button">
                Disconnect
              </Link>
            </MenuItem>
          </div>
        )}
      </Menu>
      <ConnectPopup
        setOpenConnect={setOpenConnect}
        openConnect={openConnect}
      ></ConnectPopup>
    </Box>
  );
};
export default renderMobileMenu;
