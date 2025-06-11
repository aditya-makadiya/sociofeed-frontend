import React from "react";
import PostCard from "../common/PostCard";
import UserPostsSkeleton from "../skeletons/UserPostsSkeleton";
import { Typography } from "@mui/material";

const UserPosts = ({ posts, loading }) => {
  if (loading) {
    return <UserPostsSkeleton count={6} />;
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <Typography variant="h6" className="text-gray-500 mb-2">
          No posts yet
        </Typography>
        <Typography variant="body2" className="text-gray-400">
          When posts are shared, they'll appear here.
        </Typography>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default UserPosts;
