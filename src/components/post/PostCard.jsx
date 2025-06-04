import React from "react";
import { Typography } from "@mui/material";

const PostCard = ({ post }) => {
  const { content, images, likeCount, commentCount } = post;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {images && images.length > 0 && (
        <img
          src={images[0]}
          alt="Post image"
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <Typography variant="body2" className="text-gray-900">
          {content}
        </Typography>
        <div className="flex justify-between mt-2 text-gray-600 text-sm">
          <span>{likeCount} Likes</span>
          <span>{commentCount} Comments</span>
        </div>
        {/* <div className="mt-2">
          <Button
            variant="text"
            color={isLiked ? 'primary' : 'inherit'}
            startIcon={<FavoriteIcon />}
            // onClick={handleLikeToggle} // TODO: Implement like/unlike
          >
            {isLiked ? 'Unlike' : 'Like'}
          </Button>
        </div> */}
      </div>
    </div>
  );
};

export default PostCard;
