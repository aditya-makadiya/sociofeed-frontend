// components/PostCard/PostActions.js
import React, { useState } from "react";
import {
  Typography,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Comment as CommentIcon,
  BookmarkBorder as SaveIcon,
  Bookmark as SavedIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const PostActions = ({
  postId,
  localState,
  onLikeToggle,
  onSaveToggle,
  onCommentSubmit,
  likeLoading,
  saveLoading,
  commentLoading,
}) => {
  const navigate = useNavigate();
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    try {
      await onCommentSubmit(commentText.trim());
      setCommentText("");
      setCommentDialogOpen(false);
    } catch (error) {
      console.error("Comment submission failed:", error);
    }
  };

  return (
    <>
      <Box className="px-4 pb-4">
        <Box className="flex items-center justify-between text-gray-600">
          <Box className="flex items-center space-x-1">
            <Tooltip title={localState.isLiked ? "Unlike" : "Like"}>
              <span>
                <IconButton
                  size="small"
                  color={localState.isLiked ? "error" : "default"}
                  disabled={likeLoading[postId]}
                  onClick={onLikeToggle}
                >
                  {localState.isLiked ? (
                    <FavoriteIcon fontSize="small" />
                  ) : (
                    <FavoriteBorderIcon fontSize="small" />
                  )}
                </IconButton>
              </span>
            </Tooltip>
            <Typography variant="caption">{localState.likeCount}</Typography>
          </Box>

          <Box className="flex items-center space-x-1">
            <Tooltip title="View comments">
              <IconButton
                size="small"
                onClick={() => navigate(`/post/${postId}`)}
              >
                <CommentIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Typography variant="caption">{localState.commentCount}</Typography>
          </Box>

          <Tooltip title={localState.isSaved ? "Unsave" : "Save"}>
            <span>
              <IconButton
                size="small"
                color={localState.isSaved ? "primary" : "default"}
                disabled={saveLoading[postId]}
                onClick={onSaveToggle}
              >
                {localState.isSaved ? (
                  <SavedIcon fontSize="small" />
                ) : (
                  <SaveIcon fontSize="small" />
                )}
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>

      <Dialog
        open={commentDialogOpen}
        onClose={() => setCommentDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add Comment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            variant="outlined"
            label="Your comment..."
            fullWidth
            multiline
            minRows={3}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            disabled={commentLoading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommentDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCommentSubmit}
            disabled={!commentText.trim() || commentLoading}
          >
            {commentLoading ? "Posting..." : "Post"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PostActions;
