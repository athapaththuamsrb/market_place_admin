import { MenuItem, Menu, ListItemText } from "@mui/material";
import Link from "@mui/material/Link";
import React, { FC } from "react";
import { Connector } from "wagmi";
import { GetAccountResult } from "@wagmi/core";
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
  return (
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
          <Link href={"/admin"} underline="none">
            Admin
          </Link>
        </MenuItem>
      )}
      <MenuItem onClick={handleMobileMenuClose}>
        <Link href={"/explore-collections"} underline="none">
          Explore
        </Link>
      </MenuItem>
      <MenuItem onClick={handleMobileMenuClose}>
        <Link href={"/create"} underline="none">
          Create
        </Link>
      </MenuItem>
      {isMounted && connectors[0].ready && !ethereumAccount && (
        <MenuItem onClick={() => connect(connectors[0])}>
          <Link href={""} underline="none">
            Connect
          </Link>
        </MenuItem>
      )}
      {isMounted && ethereumAccount && (
        <div>
          <MenuItem onClick={handleMobileMenuClose}>
            <Link href={"/account"} underline="none">
              Profile
            </Link>
          </MenuItem>
          <MenuItem onClick={handleMobileMenuClose}>
            <Link href={"/account/collection"} underline="none">
              My Collection
            </Link>
          </MenuItem>
          <MenuItem
            onClick={() => {
              disconnect();
              handleClose();
            }}
          >
            <Link href={""} underline="none">
              Disconnect
            </Link>
          </MenuItem>
        </div>
      )}
    </Menu>
  );
};
export default renderMobileMenu;
