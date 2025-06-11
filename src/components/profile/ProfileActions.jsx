import React from "react";
import { Button } from "@mui/material";

const ProfileActions = React.memo(
  ({
    isOwnProfile,
    isFollowing,
    followLoading,
    onFollow,
    onUnfollow,
    onEditProfile,
  }) => (
    <div className="mt-3 sm:mt-4">
      {isOwnProfile ? (
        <Button
          variant="outlined"
          color="primary"
          sx={{
            textTransform: "none",
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
          }}
          onClick={onEditProfile}
        >
          Edit Profile
        </Button>
      ) : (
        <Button
          variant={isFollowing ? "outlined" : "contained"}
          color="primary"
          size="small"
          sx={{
            textTransform: "none",
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
          }}
          onClick={isFollowing ? onUnfollow : onFollow}
          disabled={followLoading}
        >
          {followLoading ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
        </Button>
      )}
    </div>
  )
);

export default ProfileActions;
