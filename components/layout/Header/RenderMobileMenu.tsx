import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Link from "next/link";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
export default function renderMobileMenu({
  isMobileMenuOpen,
  mobileMenuId,
  isConnect,
  handleMobileMenuClose,
  mobileMoreAnchorEl,
}) {
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
}
