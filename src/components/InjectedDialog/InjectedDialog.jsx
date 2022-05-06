import React, { useState, useEffect, useContext } from "react";
import MenuBar from "../MenuBar/MenuBar";
import ChannelMessages from "../ChannelMessages/ChannelMessages";
import DirectMessages from "../DirectMessages/DirectMessages";
import Box from "@mui/material/Box";
import About from "../About/About";
import {
  discordPrimary,
  fontFamily,
  textSecondary,
} from "../../styleConstants";
import { UserContext } from "../../context/user/UserContext";
import CloseWindowButton from "./CloseWindowButton";
import DevelopmentMessages from "./DevelopmentMessages";
import { MessageContext } from "../../context/message/MessageContext";
import { ChannelContext } from "../../context/channel/ChannelContext";
import { GuildContext } from "../../context/guild/GuildContext";

function InjectedDialog() {
  const { getUserData } = useContext(UserContext);
  const { resetChannel } = useContext(ChannelContext);
  const { resetMessageData } = useContext(MessageContext);
  const { resetGuild } = useContext(GuildContext);

  const [menuIndex, setMenuIndex] = useState(0);

  const handleChangeMenuIndex = async (index) => {
    await resetMessageData();
    await resetChannel();
    await resetGuild();
    setMenuIndex(index);
  };

  useEffect(() => {
    getUserData();
  }, [getUserData]);

  return (
    <Box
      sx={{
        backgroundColor: discordPrimary,
        height: "700px",
        width: "775px",
        color: textSecondary,
        fontFamily: fontFamily,
        padding: 0,
        margin: 0,
        border: `1px solid ${textSecondary.slice(0, 18) + "0.2)"}`,
        wordWrap: "break-word",
        overflow: "hidden",
        borderRadius: "1px",
      }}
    >
      <MenuBar menuIndex={menuIndex} setMenuIndex={handleChangeMenuIndex} />
      {menuIndex === 0 && <ChannelMessages />}
      {menuIndex === 1 && <DirectMessages />}
      {menuIndex === 2 && <About />}
      <DevelopmentMessages />
      <CloseWindowButton />
    </Box>
  );
}

export default InjectedDialog;
