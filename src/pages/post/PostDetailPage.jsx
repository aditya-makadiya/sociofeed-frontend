import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import PostCard from "../../components/common/PostCard";
import usePost from "../../hooks/usePost";
import usePostActions from "../../hooks/usePostActions";
import postService from "../../services/postService";
import CommentsSection from "../../components/comment/CommentsSection";
import { toast } from "react-toastify";

const PostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const {
    handleGetComments,
    comments,
    commentLoading,
    handleAddComment,
    handleUpdateComment,
    handleDeleteComment,
    currentUser,
  } = usePost();
  const { handleToggleLike, handleToggleSave } = usePostActions();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);

  const isValidUUID = (id) => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

  useEffect(() => {
    if (!postId || !isValidUUID(postId)) {
      console.error("Invalid post ID format:", postId);
      toast.error("Invalid post ID.");
      navigate("/404", { state: { message: "Invalid post ID format." } });
      return;
    }

    const fetchPostDetails = async () => {
      try {
        const response = await postService.getPostDetails(postId);
        setPost(response.data.post);
        await handleGetComments(postId);
      } catch (err) {
        setError("Failed to fetch post details.");
        console.error("Error fetching post details:", err);
      }
    };

    fetchPostDetails();
  }, [postId]);

  const onAddComment = async (postId, content) => {
    try {
      const result = await handleAddComment(postId, content);
      if (result) {
        await handleGetComments(postId);
        if (post) {
          setPost((prev) => ({
            ...prev,
            commentCount: (prev.commentCount || 0) + 1,
          }));
        }
        // toast.success("Comment added successfully!");
      }
    } catch (error) {
      console.error("onAddComment error:", error);
      toast.error("Failed to add comment. Please try again.");
    }
  };

  const onUpdateComment = async (postId, commentId, content) => {
    try {
      const result = await handleUpdateComment(postId, commentId, content);
      if (result) {
        await handleGetComments(postId);
        // toast.success("Comment updated successfully!");
      }
    } catch (error) {
      console.error("onUpdateComment error:", error);
      toast.error("Failed to update comment. Please try again.");
    }
  };

  const onDeleteComment = async (postId, commentId) => {
    try {
      const result = await handleDeleteComment(postId, commentId);
      if (result) {
        await handleGetComments(postId); // Refresh comments
        if (post) {
          setPost((prev) => ({
            ...prev,
            commentCount: (prev.commentCount || 1) - 1,
          }));
        }
        // toast.success("Comment deleted successfully!");
      }
    } catch (error) {
      console.error("onDeleteComment error:", error);
      toast.error("Failed to delete comment. Please try again.");
    }
  };

  const handleLikeToggle = async () => {
    if (!post) return;
    const newLikeCount = await handleToggleLike(post.id, post.isLiked);
    if (newLikeCount !== null) {
      setPost((prev) => ({
        ...prev,
        isLiked: !prev.isLiked,
        likeCount: newLikeCount,
      }));
    }
  };

  const handleSaveToggle = async () => {
    if (!post) return;
    await handleToggleSave(post.id, post.isSaved);
    setPost((prev) => ({ ...prev, isSaved: !prev.isSaved }));
  };

  if (error) {
    return (
      <Box sx={{ maxWidth: 1200, mx: "auto", mt: 16, p: 3 }}>
        <Typography color="error" variant="h6" align="center">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!post) {
    return (
      <Box
        sx={{ maxWidth: 1200, mx: "auto", mt: 16, p: 3, textAlign: "center" }}
      >
        <Typography variant="h6" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        mt: 16,
        px: 3,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 6,
        pb: 16,
      }}
    >
      <Box sx={{ flex: { xs: "auto", md: "0 0 60%" }, minWidth: 0 }}>
        <PostCard
          post={post}
          onLikeToggle={handleLikeToggle}
          onSaveToggle={handleSaveToggle}
        />
      </Box>

      <Box
        sx={{
          flex: { xs: "auto", md: "0 0 40%" },
          minWidth: 0,
          maxHeight: { md: "80vh" },
          overflowY: { md: "auto" },
        }}
        aria-label="Comments section container"
      >
        <CommentsSection
          comments={comments}
          postId={postId}
          onAddComment={onAddComment}
          onUpdateComment={onUpdateComment}
          onDeleteComment={onDeleteComment}
          commentLoading={commentLoading}
          currentUserId={currentUser?.id}
        />
      </Box>
    </Box>
  );
};

export default PostDetailPage;
