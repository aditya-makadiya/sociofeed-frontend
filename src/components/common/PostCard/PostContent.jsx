import React from "react";
import { Box } from "@mui/material";
import DOMPurify from "dompurify";
import "../../post/EditorComponent.css"; // Adjust path based on project structure

const PostContent = ({ content }) => {
  if (!content) return null;

  // Configure DOMPurify to allow class attributes
  const sanitized = DOMPurify.sanitize(content, {
    ADD_ATTR: ["class"],
  });

  return (
    <Box className="px-4 pb-2">
      <div
        className="prose prose-sm text-gray-600 custom-editor mb-4"
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
    </Box>
  );
};

export default React.memo(PostContent);
