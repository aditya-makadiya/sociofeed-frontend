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
  Box,
  IconButton as MuiIconButton,
} from "@mui/material";
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Comment as CommentIcon,
  BookmarkBorder as SaveIcon,
  Bookmark as SavedIcon,
  ArrowBackIos,
  ArrowForwardIos,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import DOMPurify from "dompurify";
import usePost from "../../hooks/usePost";
import { showErrorToast } from "../notifications/toastUtils";
import postService from "../../services/postService";

const PostCard = ({ post, onPostUpdate }) => {
  const {
    id,
    content = "",
    images = [],
    likeCount: initLike = 0,
    commentCount: initComment = 0,
    isLiked: initLiked = false,
    isSaved: initSaved = false,
    user,
    createdAt,
  } = post;

  const [localState, setLocalState] = useState({
    isLiked: initLiked,
    isSaved: initSaved,
    likeCount: Number(initLike),
    commentCount: Number(initComment),
  });
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Track current image

  const {
    handleLikePost,
    handleSavePost,
    handleAddComment,
    likeLoading,
    saveLoading,
    commentLoading,
  } = usePost();

  // Reset local state when props change
  useEffect(() => {
    setLocalState({
      isLiked: initLiked,
      isSaved: initSaved,
      likeCount: Number(initLike),
      commentCount: Number(initComment),
    });
    setCurrentImageIndex(0); // Reset image index when post changes
  }, [initLiked, initSaved, initLike, initComment]);

  const timeAgo = createdAt
    ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
    : "Unknown time";

  const sanitized = DOMPurify.sanitize(content);

  // Image navigation handlers
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Action handlers (unchanged)
  const handleLikeToggle = async () => {
    const { isLiked, likeCount } = localState;
    const newLiked = !isLiked;
    const newCount = newLiked ? likeCount + 1 : Math.max(likeCount - 1, 0);

    setLocalState({ ...localState, isLiked: newLiked, likeCount: newCount });

    try {
      const res = await handleLikePost(id, isLiked);
      if (res) {
        setLocalState({
          ...localState,
          isLiked: res.isLiked,
          likeCount: Number(res.likeCount),
        });
        onPostUpdate?.(id, {
          isLiked: res.isLiked,
          likeCount: res.likeCount,
        });
      } else {
        throw new Error("null response");
      }
    } catch (err) {
      console.error(err);
      try {
        const detail = await postService.getPostDetails(id);
        const srv = detail.data;
        setLocalState({
          ...localState,
          isLiked: srv.isLiked,
          likeCount: Number(srv.likeCount),
        });
        onPostUpdate?.(id, {
          isLiked: srv.isLiked,
          likeCount: srv.likeCount,
        });
      } catch {
        setLocalState({
          ...localState,
          isLiked,
          likeCount,
        });
      }
      showErrorToast(err.message || "Like update failed");
    }
  };

  const handleSaveToggle = async () => {
    const newSaved = !localState.isSaved;
    setLocalState({ ...localState, isSaved: newSaved });
    try {
      const res = await handleSavePost(id, localState.isSaved);
      if (res) {
        setLocalState({ ...localState, isSaved: res.isSaved });
        onPostUpdate?.(id, { isSaved: res.isSaved });
      }
    } catch (err) {
      console.error(err);
      setLocalState({ ...localState, isSaved: !newSaved });
      showErrorToast("Save update failed");
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    try {
      const res = await handleAddComment(id, commentText.trim());
      if (res) {
        setLocalState({
          ...localState,
          commentCount: Number(res.commentCount),
        });
        onPostUpdate?.(id, { commentCount: res.commentCount });
        setCommentText("");
        setCommentDialogOpen(false);
      }
    } catch (err) {
      console.error(err);
      showErrorToast("Comment failed");
    }
  };

  return (
    <>
      <Box
        component="article"
        className="bg-white rounded-lg shadow-md mb-6 transition hover:shadow-lg"
      >
        {/* Header */}
        <Box className="p-4 flex items-center space-x-3">
          <Link to={`/profile/${user?.id}`}>
            <Avatar
              src={user?.avatar}
              alt={user?.username}
              sx={{ width: 40, height: 40 }}
            />
          </Link>
          <Box>
            <Link to={`/profile/${user?.id}`}>
              <Typography
                variant="subtitle2"
                className="font-bold hover:underline"
              >
                {user?.username || "Unknown"}
              </Typography>
            </Link>
            <Typography variant="caption" className="text-gray-500">
              {timeAgo}
            </Typography>
          </Box>
        </Box>

        {/* Image Carousel */}
        {images.length > 0 && (
          <Box className="w-full relative">
            <Box
              className="w-full"
              sx={{
                aspectRatio: "16/9", // Adjust aspect ratio as needed
                overflow: "hidden",
                position: "relative",
              }}
            >
              <img
                src={images[currentImageIndex]}
                alt={`Post image ${currentImageIndex + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain", // Ensure full image is visible
                  objectPosition: "center",
                }}
                loading="lazy"
              />
            </Box>
            {images.length > 1 && (
              <>
                {/* Previous Button */}
                <MuiIconButton
                  onClick={handlePrevImage}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: 8,
                    transform: "translateY(-50%)",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                    "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
                  }}
                >
                  <ArrowBackIos fontSize="small" />
                </MuiIconButton>
                {/* Next Button */}
                <MuiIconButton
                  onClick={handleNextImage}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    right: 8,
                    transform: "translateY(-50%)",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                    "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
                  }}
                >
                  <ArrowForwardIos fontSize="small" />
                </MuiIconButton>
                {/* Image Counter */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 8,
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    fontSize: "0.75rem",
                  }}
                >
                  {currentImageIndex + 1} / {images.length}
                </Box>
              </>
            )}
          </Box>
        )}

        {/* Content */}
        <Box className="p-4">
          {sanitized && (
            <div
              className="prose prose-sm text-gray-800 mb-4 line-clamp-3"
              dangerouslySetInnerHTML={{ __html: sanitized }}
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            />
          )}

          {/* Actions */}
          <Box className="flex items-center justify-between text-gray-600">
            {/* Like */}
            <Box className="flex items-center space-x-1">
              <Tooltip title={localState.isLiked ? "Unlike" : "Like"}>
                <span>
                  <IconButton
                    size="small"
                    color={localState.isLiked ? "error" : "default"}
                    disabled={likeLoading[id]}
                    onClick={handleLikeToggle}
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

            {/* Comment */}
            <Box className="flex items-center space-x-1">
              <Tooltip title="Add comment">
                <IconButton
                  size="small"
                  onClick={() => setCommentDialogOpen(true)}
                >
                  <CommentIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Typography variant="caption">
                {localState.commentCount}
              </Typography>
            </Box>

            {/* Save */}
            <Tooltip title={localState.isSaved ? "Unsave" : "Save"}>
              <span>
                <IconButton
                  size="small"
                  color={localState.isSaved ? "primary" : "default"}
                  disabled={saveLoading[id]}
                  onClick={handleSaveToggle}
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
      </Box>

      {/* Comment Dialog */}
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

export default PostCard;
