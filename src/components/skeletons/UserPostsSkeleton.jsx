// components/skeletons/UserPostsSkeleton.jsx
import React from "react";
import PostCardSkeleton from "./PostCardSkeleton";

const UserPostsSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <PostCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default UserPostsSkeleton;
