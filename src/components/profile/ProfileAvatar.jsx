import React from "react";
import { Person as PersonIcon } from "@mui/icons-material";

const ProfileAvatar = React.memo(({ avatar, username }) => (
  <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden flex-shrink-0">
    {avatar ? (
      <img
        src={avatar}
        alt={`${username}'s avatar`}
        className="w-full h-full object-cover"
      />
    ) : (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        <PersonIcon sx={{ fontSize: { xs: 32, sm: 40 }, color: "#4b5563" }} />
      </div>
    )}
  </div>
));

export default ProfileAvatar;
