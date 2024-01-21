import { useState } from "react";
import { Alert, Avatar, Box, Snackbar } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import copy from "copy-to-clipboard";
import Message from "../classes/message";
import { useGuildSlice } from "../features/guild/use-guild-slice";
import { useExportSlice } from "../features/export/use-export-slice";
import { getAvatarUrl } from "../utils";

type AuthorAvatarProps = {
  message: Message;
  isReply?: boolean;
  browserView: boolean;
};

const AuthorAvatar = ({
  message,
  isReply = false,
  browserView,
}: AuthorAvatarProps) => {
  const author = message.author;
  const avatarId = author.avatar;
  const userId = author.id;
  const { state: guildState } = useGuildSlice();
  const selectedGuild = guildState.selectedGuild();

  const { state: exportState } = useExportSlice();
  const avatarMap = exportState.avatarMap();
  const userMap = exportState.userMap();

  const guildNickName =
    userMap[author.id]?.guilds[String(selectedGuild?.id)]?.nick;
  const name = guildNickName || author.global_name || author.username;
  const [textCopied, setTextCopied] = useState(false);

  const handleAvatarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (browserView && !isReply) {
      e.stopPropagation();
      copy(userId);
      setTextCopied(true);
    }
  };

  const idAndAvatar = `${userId}/${avatarId}`;
  let avatarUrl = getAvatarUrl(message.author);
  if (avatarMap && avatarMap[idAndAvatar] && !browserView) {
    avatarUrl = `../${avatarMap[idAndAvatar]}`;
  }

  return (
    <>
      <Box
        sx={{
          position: "relative",
          width: isReply ? "15px !important" : "40px",
          height: isReply ? "15px !important" : "40px",
          minWidth: isReply ? "15px !important" : "40px",
        }}
      >
        <Avatar
          onClick={handleAvatarClick}
          sx={{
            position: "absolute",
            width: isReply ? "15px !important" : "40px",
            height: isReply ? "15px !important" : "40px",
            minWidth: isReply ? "15px !important" : "40px",
            boxShadow: !isReply
              ? "rgba(0, 0, 0, 0.75) 5px 4px 1px -2px"
              : undefined,
            transition: "all ease-in-out .1s",
            "&:hover": {
              boxShadow:
                !isReply && browserView
                  ? "rgba(0, 0, 0, 0.75) 5px 4px 1px 1px"
                  : undefined,
              width: !isReply && browserView ? "42px" : undefined,
              height: !isReply && browserView ? "42px" : undefined,
              cursor: !isReply && browserView ? "pointer" : undefined,
            },
          }}
          src={avatarUrl}
        >
          <PersonIcon />
        </Avatar>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={2000}
        open={textCopied}
        onClose={() => {
          setTextCopied(false);
        }}
      >
        <Alert variant="filled" severity="info">
          User ID copied from <strong>{name}</strong>
        </Alert>
      </Snackbar>
    </>
  );
};
export default AuthorAvatar;
