import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import CommentForm from "./CommentForm";
import CommentsList from "./CommentsList";

const CommentsSection = ({
  comments,
  postId,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  commentLoading,
  currentUserId,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        width: "100%",
      }}
      component="section"
      aria-label="Comments section"
    >
      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 2,
          backgroundColor: "#fff",
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: "#1f2937", mb: 1 }}
        >
          Add a Comment
        </Typography>
        <CommentForm
          postId={postId}
          onAddComment={onAddComment}
          disabled={commentLoading}
        />
      </Paper>

      <Box sx={{ pt: 1 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: "#1f2937", mb: 2 }}
        >
          Comments ({comments.length})
        </Typography>
        <CommentsList
          comments={comments}
          currentUserId={currentUserId}
          onUpdateComment={onUpdateComment}
          onDeleteComment={onDeleteComment}
          postId={postId}
        />
      </Box>
    </Box>
  );
};

export default CommentsSection;
