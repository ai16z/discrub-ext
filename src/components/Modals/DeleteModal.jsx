import React, { useState, useEffect, useRef, useContext } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import { textSecondary } from "../../styleConstants";
import { deleteMessage, editMessage } from "../../discordService";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import MessageChip from "../Chips/MessageChip";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import Box from "@mui/material/Box";
import ModalDebugMessage from "./Utility/ModalDebugMessage";
import { toggleDebugPause } from "./Utility/utility";
import { UserContext } from "../../context/user/UserContext";
import {
  Paper,
  Typography,
  Button,
  Checkbox,
  Stack,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@mui/material";

const DeleteModal = ({
  open,
  handleClose,
  rows,
  selected,
  setOriginalRows,
  originalRows,
}) => {
  const { state: userState } = useContext(UserContext);
  const { token } = userState;

  const [deleteConfig, setDeleteConfig] = useState({
    attachments: true,
    messages: true,
  });
  const [deleting, setDeleting] = useState(false);
  const [returnRows, setReturnRows] = useState(rows);
  const [deleteObj, setDeleteObj] = useState(null);
  const [debugMessage, setDebugMessage] = useState("");
  const openRef = useRef();
  openRef.current = open;
  const returnRowsRef = useRef();
  returnRowsRef.current = returnRows;
  const originalRowsRef = useRef();
  originalRowsRef.current = originalRows;

  useEffect(() => {
    setDeleteConfig({ attachments: true, messages: true });
  }, [open]);

  const handleDeleteMessage = async () => {
    setDeleting(true);
    setReturnRows(rows);
    let channelId = rows[0]?.channel_id;
    let count = 0;
    let selectedRows = await rows.filter((x) => selected.includes(x.id));
    while (count < selected.length && openRef.current) {
      let currentRow = await selectedRows.filter(
        (x) => x.id === selected[count]
      )[0];
      setDeleteObj(currentRow);
      try {
        if (
          (deleteConfig.attachments && deleteConfig.messages) ||
          (currentRow.content.length === 0 && deleteConfig.attachments) ||
          (currentRow.attachments.length === 0 && deleteConfig.messages)
        ) {
          const response = await deleteMessage(
            token,
            selected[count],
            channelId
          );
          if (response.status === 204) {
            let updatedOriginalRows = await originalRowsRef.current.filter(
              (originalRow) => originalRow.id !== selected[count]
            );
            let updatedReturnRows = await returnRowsRef.current.filter(
              (retRow) => retRow.id !== selected[count]
            );
            setOriginalRows(updatedOriginalRows);
            setReturnRows(updatedReturnRows);
            count++;
          } else if (response.retry_after) {
            await toggleDebugPause(
              setDebugMessage,
              `Pausing for ${((response.retry_after % 60000) / 1000).toFixed(
                0
              )} seconds...`,
              response.retry_after
            );
          } else {
            await toggleDebugPause(
              setDebugMessage,
              "You do not have permission to modify this message!"
            );
            count++;
          }
        } else if (deleteConfig.attachments || deleteConfig.messages) {
          const data = await editMessage(
            token,
            selected[count],
            deleteConfig.attachments ? { attachments: [] } : { content: "" },
            channelId
          );
          if (!data.message) {
            let updatedRows = [];
            let updatedOriginalRows = [];
            await returnRowsRef.current.forEach((returnRow) => {
              if (returnRow.id === data.id)
                updatedRows.push({ ...data, username: data.author.username });
              else
                updatedRows.push({
                  ...returnRow,
                  username: returnRow.author.username,
                });
            });
            await originalRowsRef.current.forEach((originalRow) => {
              if (originalRow.id === data.id)
                updatedOriginalRows.push({
                  ...data,
                  username: data.author.username,
                });
              else
                updatedOriginalRows.push({
                  ...originalRow,
                  username: originalRow.author.username,
                });
            });
            setOriginalRows(updatedOriginalRows);
            setReturnRows(updatedRows);
            count++;
          } else if (data.retry_after) {
            await toggleDebugPause(
              setDebugMessage,
              `Pausing for ${((data.retry_after % 60000) / 1000).toFixed(
                0
              )} seconds...`,
              data.retry_after
            );
          } else {
            await toggleDebugPause(
              setDebugMessage,
              "You do not have permission to modify this message!"
            );
            count++;
          }
        } else break;
      } catch (e) {
        console.error("Error Deleting Message");
      }
    }
    setDeleting(false);
    handleClose(returnRowsRef.current);
  };
  return (
    <Dialog fullWidth open={open} onClose={() => handleClose(returnRows)}>
      <DialogTitle>
        <Typography variant="h5">Delete Data</Typography>
        <Typography variant="caption">
          Proceed with caution, this is permanent!
        </Typography>
      </DialogTitle>
      <DialogContent>
        <FormGroup>
          <FormControlLabel
            sx={{
              color: textSecondary,
              userSelect: "none",
              "& .MuiFormControlLabel-label.Mui-disabled": {
                color: textSecondary,
              },
            }}
            control={
              <Checkbox
                color="secondary"
                disabled={deleting}
                defaultChecked
                onChange={(e) => {
                  setDeleteConfig({
                    ...deleteConfig,
                    attachments: e.target.checked,
                  });
                }}
              />
            }
            label="Attachments"
          />
          <FormControlLabel
            sx={{
              color: textSecondary,
              userSelect: "none",
              "& .MuiFormControlLabel-label.Mui-disabled": {
                color: textSecondary,
              },
            }}
            control={
              <Checkbox
                color="secondary"
                disabled={deleting}
                defaultChecked
                onChange={(e) => {
                  setDeleteConfig({
                    ...deleteConfig,
                    messages: e.target.checked,
                  });
                }}
              />
            }
            label="Messages"
          />
          {deleting && deleteObj && (
            <>
              <Box
                my={1}
                sx={{
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <MessageChip
                  avatar={`https://cdn.discordapp.com/avatars/${deleteObj.author.id}/${deleteObj.author.avatar}.png`}
                  username={deleteObj.username}
                  content={deleteObj.content}
                />
                <ArrowRightAltIcon sx={{ color: textSecondary }} />
                <DeleteSweepIcon sx={{ color: "red" }} />
              </Box>
              <ModalDebugMessage debugMessage={debugMessage} />
              <Stack justifyContent="center" alignItems="center">
                <CircularProgress />
              </Stack>
              <Typography sx={{ display: "block" }} variant="caption">
                {deleteObj.id}
              </Typography>
            </>
          )}
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => handleClose(returnRows)}
          color="secondary"
        >
          Close
        </Button>
        <Button
          variant="contained"
          disabled={deleting}
          onClick={handleDeleteMessage}
          autoFocus
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default DeleteModal;
