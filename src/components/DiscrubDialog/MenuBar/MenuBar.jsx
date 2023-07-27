import React, { useState } from "react";
import ChatIcon from "@mui/icons-material/Chat";
import EmailIcon from "@mui/icons-material/Email";
import MenuBarStyles from "./Styles/MenuBar.styles";
import DataObjectIcon from "@mui/icons-material/DataObject";
import {
  Box,
  Button,
  Divider,
  Icon,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import GitHubIcon from "@mui/icons-material/GitHub";
import RedditIcon from "@mui/icons-material/Reddit";

const MenuBar = ({ menuIndex, setMenuIndex }) => {
  const classes = MenuBarStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = !!anchorEl;

  const menuItems = [
    { name: "Channel Messages", icon: <ChatIcon /> },
    { name: "Direct Messages", icon: <EmailIcon /> },
    { name: "Change Log", icon: <DataObjectIcon /> },
  ];

  return (
    <Box className={classes.menuBox}>
      <Button
        color="secondary"
        startIcon={menuOpen ? <MenuOpenIcon /> : <MenuIcon />}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        Menu
      </Button>
      <Button
        onClick={() =>
          window.open(
            "https://chrome.google.com/webstore/detail/discrub/plhdclenpaecffbcefjmpkkbdpkmhhbj",
            "_blank"
          )
        }
        color="secondary"
        startIcon={
          <Icon>
            <img
              style={{ display: "flex", height: "inherit", width: "inherit" }}
              src="chromestore.svg"
              alt="chrome store"
            />
          </Icon>
        }
      >
        Review on Webstore
      </Button>
      <Button
        onClick={() => window.open("https://ko-fi.com/prathercc", "_blank")}
        color="secondary"
        startIcon={
          <Icon>
            <img
              style={{ display: "flex", height: "inherit", width: "inherit" }}
              src="kofi.svg"
              alt="kofi"
            />
          </Icon>
        }
      >
        Donate with Ko-Fi
      </Button>

      <Menu
        dense
        open={menuOpen}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        {menuItems.map((menuItem, i) => (
          <MenuItem
            disabled={menuIndex === i}
            onClick={() => {
              setMenuIndex(i);
              setAnchorEl(null);
            }}
          >
            <ListItemIcon>{menuItem.icon}</ListItemIcon>
            <ListItemText>{menuItem.name}</ListItemText>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem
          onClick={() => {
            window.open("https://github.com/prathercc/discrub-ext", "_blank");
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <GitHubIcon />
          </ListItemIcon>
          <ListItemText>GitHub</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            window.open("https://www.reddit.com/r/discrub/", "_blank");
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <RedditIcon />
          </ListItemIcon>
          <ListItemText>Reddit</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default MenuBar;
