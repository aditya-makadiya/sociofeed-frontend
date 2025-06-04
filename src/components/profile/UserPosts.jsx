import React from "react";
import PostCard from "../post/PostCard";
import { Typography } from "@mui/material";

const UserPosts = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return (
      <Typography className="text-center text-gray-600 mt-6">
        No posts yet
      </Typography>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default UserPosts;
