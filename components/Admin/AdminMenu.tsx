import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PersonIcon from "@mui/icons-material/Person";
import CollectionsIcon from "@mui/icons-material/Collections";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Typography } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import Link from "@mui/material/Link";
import theme from "../../src/theme";

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

export default function CustomizedMenus() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="demo-customized-button"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        size="small"
        color="primary"
        sx={{
          minWidth: "40%",
          height: "50px",
          borderRadius: 3,
        }}
        //sx={{display:"inline"}}
      >
        <Typography
          color="white"
          variant="h6"
          sx={{
            fontWeight: 500,
            [theme.breakpoints.down("sm")]: {
              fontWeight: 600,
              fontSize: 15,
            },
          }}
        >
          Reports
        </Typography>
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <Link href="/admin/report/nft" underline="none">
          <MenuItem
            onClick={handleClose}
            disableRipple
            href="/admin/report/nft"
          >
            <ImageIcon />
            <Typography variant="body1">Reported NFTs</Typography>
          </MenuItem>
        </Link>
        <Link href="/admin/report/users" underline="none">
          <MenuItem onClick={handleClose} disableRipple>
            <PersonIcon />
            Reported Users
          </MenuItem>
        </Link>
        <Link href="/admin/report/collection" underline="none">
          <MenuItem onClick={handleClose} disableRipple>
            <CollectionsIcon />
            Reported Collections
          </MenuItem>
        </Link>
      </StyledMenu>
    </div>
  );
}
