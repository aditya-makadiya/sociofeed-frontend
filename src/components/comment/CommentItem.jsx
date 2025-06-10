import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const CommentItem = ({
  comment,
  currentUserId,
  onUpdateComment,
  onDeleteComment,
  postId,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditContent(comment.content);
  };

  const handleSave = async () => {
    if (editContent.trim()) {
      await onUpdateComment(postId, comment.id, editContent.trim());
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      await onDeleteComment(postId, comment.id);
    }
  };

  const isOwnComment = comment.user?.id === currentUserId;

  return (
    <Box
      component="article"
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
        p: 2,
        mb: 2,
        backgroundColor: "#fff",
        borderRadius: 2,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <Avatar
        src={comment.user?.avatar || "/default-avatar.png"}
        alt={comment.user?.username || "Unknown User"}
        sx={{ width: 48, height: 48, flexShrink: 0 }}
      />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 0.5,
            width: "100%",
          }}
        >
          <Typography
            component={Link}
            to={`/profile/${comment.user?.id || "#"}`}
            variant="subtitle2"
            sx={{
              fontWeight: "bold",
              color: "text.primary",
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
              },
              cursor: "pointer",
            }}
          >
            {comment.user?.username || "Unknown User"}
          </Typography>
          {isOwnComment && (
            <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
              <IconButton
                size="small"
                onClick={handleEdit}
                aria-label="Edit comment"
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={handleDelete}
                aria-label="Delete comment"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
        {isEditing ? (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <TextField
              variant="outlined"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              multiline
              rows={3}
              sx={{ width: "100%" }}
            />
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={!editContent.trim()}
              >
                Save
              </Button>
              <Button variant="outlined" onClick={handleCancel}>
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography
            variant="body1"
            sx={{
              color: "#6b7280",
              fontSize: 16,
              lineHeight: 1.5,
              whiteSpace: "pre-wrap",
              textAlign: "left",
            }}
          >
            {comment.content}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default CommentItem;
