import { MenuItem, Menu } from "@mui/material";
import Link from "next/link";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import React, {
  ChangeEvent,
  FC,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
type RenderMobileMenuProps = {
  isMobileMenuOpen: boolean;
  mobileMenuId: string;
  isConnect: boolean;
  handleMobileMenuClose: () => void;
  mobileMoreAnchorEl: null | HTMLElement;
};
const renderMobileMenu: FC<RenderMobileMenuProps> = ({
  isMobileMenuOpen,
  mobileMenuId,
  isConnect,
  handleMobileMenuClose,
  mobileMoreAnchorEl,
}) => {
  return (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      // keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <Link href={"/create"}>Create</Link>
      </MenuItem>
      {isConnect && (
        <MenuItem>
          <Link href={"/connect"}>Connect</Link>
        </MenuItem>
      )}
      {!isConnect && (
        <MenuItem>
          <Link href={"/account"}>
            <AccountCircleOutlinedIcon />
          </Link>
        </MenuItem>
      )}
    </Menu>
  );
};
export default renderMobileMenu;
