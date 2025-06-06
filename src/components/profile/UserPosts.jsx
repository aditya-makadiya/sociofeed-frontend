// components/profile/UserPosts.jsx
import React, { useState, useEffect } from "react";
import PostCard from "../post/PostCard";
import UserPostsSkeleton from "../skeletons/UserPostsSkeleton";
import { Typography } from "@mui/material";

const UserPosts = ({ posts, loading = false }) => {
  const [localPosts, setLocalPosts] = useState(posts || []);

  // Update local posts when props change
  useEffect(() => {
    setLocalPosts(posts || []);
  }, [posts]);

  // Handle post updates from child components
  const handlePostUpdate = (postId, updates) => {
    setLocalPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, ...updates } : post,
      ),
    );
  };

  // Show skeleton while loading
  if (loading) {
    return <UserPostsSkeleton count={6} />;
  }

  // Show empty state
  if (!localPosts || localPosts.length === 0) {
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
      {/* Responsive grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {localPosts.map((post) => (
          <PostCard key={post.id} post={post} onPostUpdate={handlePostUpdate} />
        ))}
      </div>
    </div>
  );
};

export default UserPosts;
