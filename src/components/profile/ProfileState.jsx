import React from "react";

const ProfileStats = React.memo(
  ({ followerCount, followingCount, onOpenFollowers, onOpenFollowing }) => (
    <div className="flex space-x-4 sm:space-x-8 mt-2 sm:mt-3 ml-2 sm:ml-6">
      <div className="text-left">
        <button
          className="text-base sm:text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
          onClick={onOpenFollowers}
          aria-label={`View ${followerCount} followers`}
        >
          {followerCount}
        </button>
        <p className="text-xs sm:text-sm text-gray-600">Followers</p>
      </div>
      <div className="text-left">
        <button
          className="text-base sm:text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
          onClick={onOpenFollowing}
          aria-label={`View ${followingCount} following`}
        >
          {followingCount}
        </button>
        <p className="text-xs sm:text-sm text-gray-600">Following</p>
      </div>
    </div>
  )
);

export default ProfileStats;
