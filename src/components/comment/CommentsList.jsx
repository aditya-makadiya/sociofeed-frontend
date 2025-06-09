// components/comments/CommentsList.jsx
import React from "react";
import Box from "@mui/material/Box";
import CommentItem from "./CommentItem";

const CommentsList = ({ comments }) => {
  return (
    <Box
      sx={{
        maxWidth: 800,
        mx: "auto",
        width: "100%",
        pt: 4,
        pb: 8,
        px: 2,
      }}
    >
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </Box>
  );
};

export default CommentsList;
