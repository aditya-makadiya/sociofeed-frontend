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
  Avatar,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CommentIcon from "@mui/icons-material/Comment";
import SaveIcon from "@mui/icons-material/BookmarkBorder";
import SavedIcon from "@mui/icons-material/Bookmark";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import usePost from "../../hooks/usePost";
import { showErrorToast } from "../notifications/toastUtils";
import postService from "../../services/postService";

const PostCard = ({ post, onPostUpdate }) => {
  const {
    id,
    content,
    images,
    likeCount: initialLikeCount = 0,
    commentCount: initialCommentCount = 0,
    isLiked: initialIsLiked = false,
    isSaved: initialIsSaved = false,
    user,
    createdAt,
  } = post;

  const [localState, setLocalState] = useState({
    isLiked: initialIsLiked,
    isSaved: initialIsSaved,
    likeCount: Number(initialLikeCount) || 0,
    commentCount: initialCommentCount,
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

  useEffect(() => {
    console.log("PostCard useEffect:", { initialLikeCount, localState }); // Debug
    setLocalState((prev) => ({
      ...prev,
      isLiked: initialIsLiked,
      isSaved: initialIsSaved,
      likeCount: Number(initialLikeCount) || 0,
      commentCount: initialCommentCount,
    }));
  }, [initialIsLiked, initialIsSaved, initialLikeCount, initialCommentCount]);

  const handleLikeToggle = async () => {
    const originalIsLiked = localState.isLiked;
    const originalLikeCount = localState.likeCount;

    // Optimistic update
    const newIsLiked = !localState.isLiked;
    const newLikeCount = newIsLiked
      ? localState.likeCount + 1
      : Math.max(localState.likeCount - 1, 0);

    setLocalState((prev) => ({
      ...prev,
      isLiked: newIsLiked,
      likeCount: newLikeCount,
    }));

    try {
      const result = await handleLikePost(id, originalIsLiked);
      console.log("handleLikeToggle result:", result); // Debug
      if (result) {
        setLocalState((prev) => ({
          ...prev,
          isLiked: result.isLiked,
          likeCount: Number(result.likeCount) || 0,
        }));
        if (onPostUpdate) {
          onPostUpdate(id, {
            isLiked: result.isLiked,
            likeCount: result.likeCount,
          });
        }
      } else {
        // Revert on null result
        setLocalState((prev) => ({
          ...prev,
          isLiked: originalIsLiked,
          likeCount: originalLikeCount,
        }));
        showErrorToast("Failed to update like status");
      }
    } catch (error) {
      console.error("handleLikeToggle error:", {
        message: error.message,
        stack: error.stack,
      }); // Debug
      // Revert on error and fetch correct likeCount
      try {
        const postDetails = await postService.getPostDetails(id);
        if (postDetails?.data) {
          setLocalState((prev) => ({
            ...prev,
            isLiked: postDetails.data.isLiked,
            likeCount: Number(postDetails.data.likeCount) || 0,
          }));
          if (onPostUpdate) {
            onPostUpdate(id, {
              isLiked: postDetails.data.isLiked,
              likeCount: postDetails.data.likeCount,
            });
          }
        } else {
          setLocalState((prev) => ({
            ...prev,
            isLiked: originalIsLiked,
            likeCount: originalLikeCount,
          }));
        }
        if (
          error.message === "Post already liked" ||
          error.message === "Post not liked"
        ) {
          showErrorToast(error.message);
        } else {
          showErrorToast("Failed to update like status");
        }
      } catch (fetchError) {
        console.error("Failed to fetch post details:", fetchError.message); // Debug
        setLocalState((prev) => ({
          ...prev,
          isLiked: originalIsLiked,
          likeCount: originalLikeCount,
        }));
        showErrorToast("Failed to sync like status");
      }
    }
  };

  const handleSaveToggle = async () => {
    const newIsSaved = !localState.isSaved;
    setLocalState((prev) => ({ ...prev, isSaved: newIsSaved }));

    try {
      const result = await handleSavePost(id, localState.isSaved);
      console.log("handleSaveToggle result:", result); // Debug
      if (result) {
        setLocalState((prev) => ({ ...prev, isSaved: result.isSaved }));
        if (onPostUpdate) {
          onPostUpdate(id, { isSaved: result.isSaved });
        }
      }
    } catch (error) {
      console.error("handleSaveToggle error:", error.message); // Debug
      setLocalState((prev) => ({ ...prev, isSaved: !newIsSaved }));
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    try {
      const result = await handleAddComment(id, commentText);
      console.log("handleCommentSubmit result:", result); // Debug
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
      console.error("handleCommentSubmit error:", error.message); // Debug
    }
  };

  const isLikeLoading = likeLoading[id] || false;
  const isSaveLoading = saveLoading[id] || false;

  const timeAgo = createdAt
    ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
    : "Unknown time";

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 mb-4">
        <div className="p-3 md:p-4 flex items-center">
          <Link to={`/profile/${user?.id}`}>
            <Avatar
              src={user?.avatar || "/default-avatar.png"}
              alt={user?.username}
              sx={{ width: 40, height: 40, mr: 2 }}
            />
          </Link>
          <div>
            <Link to={`/profile/${user?.id}`}>
              <Typography
                variant="subtitle2"
                className="font-semibold text-gray-900 hover:underline"
              >
                {user?.username || "Unknown User"}
              </Typography>
            </Link>
            <Typography variant="caption" className="text-gray-500">
              {timeAgo}
            </Typography>
          </div>
        </div>
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
                <span>
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
                </span>
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
              <span>
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
              </span>
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
