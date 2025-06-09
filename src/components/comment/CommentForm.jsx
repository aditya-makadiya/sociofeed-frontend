// components/comment/CommentForm.jsx
import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";

const CommentForm = ({ postId, onAddComment, disabled }) => {
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.trim()) {
      await onAddComment(postId, comment.trim());
      setComment("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={disabled}
          multiline
          rows={3}
          sx={{ width: "100%" }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={disabled || comment.trim() === ""}
        >
          {disabled ? "Posting..." : "Post Comment"}
        </Button>
      </Box>
    </form>
  );
};

export default CommentForm;
