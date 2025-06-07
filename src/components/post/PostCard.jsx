// components/post/PostCard.jsx
import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CommentIcon from "@mui/icons-material/Comment";
import SaveIcon from "@mui/icons-material/BookmarkBorder";
import SavedIcon from "@mui/icons-material/Bookmark";
import usePost from "../../hooks/usePost";

const PostCard = ({ post, onPostUpdate }) => {
  const {
    id,
    content,
    images,
    likeCount: initialLikeCount,
    commentCount: initialCommentCount,
    isLiked: initialIsLiked,
    isSaved: initialIsSaved,
  } = post;

  // Local state for immediate UI updates
  const [localState, setLocalState] = useState({
    isLiked: initialIsLiked || false,
    isSaved: initialIsSaved || false,
    likeCount: initialLikeCount || 0,
    commentCount: initialCommentCount || 0,
  });

  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [commentText, setCommentText] = useState("");

  const {
    handleLikePost,
    handleSavePost,
    handleAddComment,
    likeLoading,
    saveLoading,
    commentLoading,
  } = usePost();

  // Update local state when post prop changes
  useEffect(() => {
    setLocalState({
      isLiked: initialIsLiked || false,
      isSaved: initialIsSaved || false,
      likeCount: initialLikeCount || 0,
      commentCount: initialCommentCount || 0,
    });
  }, [initialIsLiked, initialIsSaved, initialLikeCount, initialCommentCount]);

  const handleLikeToggle = async () => {
    const newIsLiked = !localState.isLiked;

    // Optimistic update for immediate UI feedback
    setLocalState((prev) => ({
      ...prev,
      isLiked: newIsLiked,
      likeCount: newIsLiked
        ? prev.likeCount + 1
        : Math.max(prev.likeCount - 1, 0),
    }));

    try {
      const result = await handleLikePost(id, localState.isLiked);
      if (result) {
        setLocalState((prev) => ({
          ...prev,
          isLiked: result.isLiked,
          likeCount: result.likeCount,
        }));
      }
    } catch (error) {
      console.error(error);
      // Revert optimistic update on error
      setLocalState((prev) => ({
        ...prev,
        isLiked: !newIsLiked, // Revert to original state
        likeCount: newIsLiked ? prev.likeCount - 1 : prev.likeCount + 1, // Revert like count
      }));
    }
  };

  const handleSaveToggle = async () => {
    // Optimistic update
    const newIsSaved = !localState.isSaved;
    setLocalState((prev) => ({ ...prev, isSaved: newIsSaved }));

    try {
      const result = await handleSavePost(id, localState.isSaved);
      if (result) {
        setLocalState((prev) => ({ ...prev, isSaved: result.isSaved }));

        if (onPostUpdate) {
          onPostUpdate(id, { isSaved: result.isSaved });
        }
      }
    } catch (error) {
      console.log(error);

      // Revert on error
      setLocalState((prev) => ({ ...prev, isSaved: !newIsSaved }));
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    try {
      const result = await handleAddComment(id, commentText);
      if (result) {
        setLocalState((prev) => ({
          ...prev,
          commentCount: result.commentCount,
        }));
        setCommentText("");
        setCommentDialogOpen(false);

        if (onPostUpdate) {
          onPostUpdate(id, { commentCount: result.commentCount });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isLikeLoading = likeLoading[id] || false;
  const isSaveLoading = saveLoading[id] || false;

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 mb-4">
        {" "}
        {/* Add margin-bottom here */}
        {images && images.length > 0 && (
          <div className="relative w-full aspect-square overflow-hidden">
            <img
              src={images[0]}
              alt="Post image"
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
            />
          </div>
        )}
        <div className="p-3 md:p-4">
          {content && (
            <Typography
              variant="body2"
              className="text-gray-900 mb-3 line-clamp-3"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {content}
            </Typography>
          )}

          <div className="flex items-center justify-between text-gray-600">
            <div className="flex items-center space-x-1">
              <Tooltip title={localState.isLiked ? "Unlike" : "Like"}>
                <IconButton
                  onClick={handleLikeToggle}
                  size="small"
                  color={localState.isLiked ? "error" : "default"}
                  className="p-1"
                  disabled={isLikeLoading}
                >
                  {localState.isLiked ? (
                    <FavoriteIcon fontSize="small" />
                  ) : (
                    <FavoriteBorderIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
              <Typography variant="caption" className="text-xs">
                {localState.likeCount}
              </Typography>
            </div>

            <div className="flex items-center space-x-1">
              <Tooltip title="Add Comment">
                <IconButton
                  size="small"
                  className="p-1"
                  onClick={() => setCommentDialogOpen(true)}
                >
                  <CommentIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Typography variant="caption" className="text-xs">
                {localState.commentCount}
              </Typography>
            </div>

            <Tooltip title={localState.isSaved ? "Unsave" : "Save"}>
              <IconButton
                onClick={handleSaveToggle}
                size="small"
                color={localState.isSaved ? "primary" : "default"}
                className="p-1"
                disabled={isSaveLoading}
              >
                {localState.isSaved ? (
                  <SavedIcon fontSize="small" />
                ) : (
                  <SaveIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </div>

      <Dialog
        open={commentDialogOpen}
        onClose={() => setCommentDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Comment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Write a comment..."
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share your thoughts..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommentDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCommentSubmit}
            variant="contained"
            disabled={!commentText.trim() || commentLoading}
          >
            {commentLoading ? "Posting..." : "Post Comment"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PostCard;
