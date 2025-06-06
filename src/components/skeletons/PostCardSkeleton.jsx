// components/skeletons/PostCardSkeleton.jsx
import React from "react";
import { Skeleton, Box } from "@mui/material";

const PostCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Image skeleton */}
      <Skeleton
        variant="rectangular"
        width="100%"
        height={192} // h-48 equivalent
        animation="wave"
      />

      {/* Content skeleton */}
      <div className="p-4">
        {/* Text content skeleton */}
        <Skeleton variant="text" width="100%" height={20} animation="wave" />
        <Skeleton
          variant="text"
          width="80%"
          height={20}
          animation="wave"
          sx={{ mt: 0.5 }}
        />

        {/* Actions skeleton */}
        <Box className="flex justify-between mt-2" sx={{ mt: 2 }}>
          <div className="flex items-center space-x-2">
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="text" width={60} height={16} />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="text" width={80} height={16} />
          </div>
          <div className="flex items-center">
            <Skeleton variant="circular" width={24} height={24} />
          </div>
        </Box>
      </div>
    </div>
  );
};

export default PostCardSkeleton;
