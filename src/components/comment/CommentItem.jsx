// components/comments/CommentItem.jsx
import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { Link } from "react-router-dom";

const CommentItem = ({ comment }) => {
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
        borderRadius: 2, // 0.75rem approx
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <Avatar
        src={comment.user.avatar}
        alt={comment.user.username}
        sx={{ width: 48, height: 48, flexShrink: 0 }}
      />
      <Box sx={{ flex: 1 }}>
        <Typography
          component={Link}
          to={`/profile/${comment.user.id}`}
          variant="subtitle2"
          sx={{
            fontWeight: "bold",
            color: "text.primary",
            textDecoration: "none",
            "&:hover": {
              textDecoration: "underline",
            },
            cursor: "pointer",
            display: "inline-block",
            mb: 0.5,
          }}
        >
          {comment.user.username}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#6b7280",
            fontSize: 16,
            lineHeight: 1.5,
            whiteSpace: "pre-wrap",
          }}
        >
          {comment.content}
        </Typography>
      </Box>
    </Box>
  );
};

export default CommentItem;
