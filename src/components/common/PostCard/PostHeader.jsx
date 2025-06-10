// components/PostCard/PostHeader.js
import React from "react";
import { Typography, Avatar, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const PostHeader = ({ user, createdAt }) => {
  const timeAgo = createdAt
    ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
    : "Unknown time";

  return (
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
          <Typography variant="subtitle2" className="font-bold hover:underline">
            {user?.username || "Unknown"}
          </Typography>
        </Link>
        <Typography variant="caption" className="text-gray-500">
          {timeAgo}
        </Typography>
      </Box>
    </Box>
  );
};

export default PostHeader;
