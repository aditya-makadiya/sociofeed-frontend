import React from "react";
import { Card, CardContent } from "@mui/material";
import {
  Favorite as FavoriteIcon,
  ChatBubbleOutline as CommentIcon,
  Share as ShareIcon,
  BookmarkBorder as BookmarkIcon,
} from "@mui/icons-material";

const PostCard = ({ post }) => {
  return (
    <Card className="mb-4 shadow-sm">
      <CardContent className="p-4">
        {/* Post Header */}
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          <div>
            <p className="font-semibold text-gray-900">User Name</p>
            <p className="text-sm text-gray-500">2 hours ago</p>
          </div>
        </div>

        {post}
        <div className="mb-4">
          <p className="text-gray-800 mb-3">
            This is a sample post content. Your actual posts will be loaded
            here.
          </p>
          {/* Post Image Placeholder */}
          <div className="w-full h-48 bg-gray-200 rounded-lg"></div>
        </div>

        {/* Post Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-6">
            <button className="flex items-center space-x-1 text-gray-600 hover:text-red-500">
              <FavoriteIcon fontSize="small" />
              <span>Like</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-500">
              <CommentIcon fontSize="small" />
              <span>Comment</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-600 hover:text-green-500">
              <ShareIcon fontSize="small" />
              <span>Share</span>
            </button>
          </div>
          <button className="text-gray-600 hover:text-yellow-500">
            <BookmarkIcon fontSize="small" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

const Feed = () => {
  // Sample data - replace with actual data
  const posts = [1, 2, 3, 4, 5];

  return (
    <div className="space-y-4">
      {posts.map((post, index) => (
        <PostCard key={index} post={post} />
      ))}

      {/* Loading Placeholder */}
      <div className="text-center py-8">
        <p className="text-gray-500">Loading more posts...</p>
      </div>
    </div>
  );
};

export default Feed;
