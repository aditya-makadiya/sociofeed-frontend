// components/PostCard/PostContent.js
import React from "react";
import { Box } from "@mui/material";
import DOMPurify from "dompurify";

const PostContent = ({ content }) => {
  if (!content) return null;

  const sanitized = DOMPurify.sanitize(content);

  return (
    <Box className="px-4 pb-2">
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
    </Box>
  );
};

export default PostContent;
