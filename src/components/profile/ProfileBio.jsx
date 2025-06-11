import React, { memo } from "react";

const ProfileBio = memo(({ bio }) => (
  <p className="text-gray-600 mt-2 sm:mt-4 text-sm sm:text-sm line-clamp-2">
    {bio || <span className="italic">No bio yet</span>}
  </p>
));

export default ProfileBio;
