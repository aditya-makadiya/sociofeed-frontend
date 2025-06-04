import React, { useState } from "react";
import { Button, Modal } from "@mui/material";
import { Person as PersonIcon, Close as CloseIcon } from "@mui/icons-material";

const ProfileHeader = ({ user, isOwnProfile }) => {
  const { username, bio, avatar, followerCount, followingCount, isFollowing } =
    user;

  // State for modal visibility and type (followers or following)
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'followers' or 'following'

  // Placeholder data for followers and following lists
  const followersList = Array.from({ length: followerCount || 0 }, (_, i) => ({
    id: i + 1,
    username: `user${i + 1}`,
  }));
  const followingList = Array.from({ length: followingCount || 0 }, (_, i) => ({
    id: i + 1,
    username: `user${i + 100}`,
  }));

  // Handlers for opening modal
  const handleOpenFollowers = () => {
    setModalType("followers");
    setModalOpen(true);
  };

  const handleOpenFollowing = () => {
    setModalType("following");
    setModalOpen(true);
  };

  // Handler for closing modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setModalType(null);
  };

  // Placeholder for follow/unfollow handlers
  const handleFollow = () => {
    console.log(`Follow ${username}`);
    // TODO: Implement follow logic
  };

  const handleUnfollow = () => {
    console.log(`Unfollow ${username}`);
    // TODO: Implement unfollow logic
  };

  // Placeholder for edit profile handler
  const handleEditProfile = () => {
    console.log("Edit profile clicked");
    // TODO: Implement edit modal
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 flex flex-row items-start gap-4 sm:gap-6 w-full">
      {/* Profile Picture (Left) */}
      <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden flex-shrink-0">
        {avatar ? (
          <img
            src={avatar}
            alt={`${username}'s avatar`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <PersonIcon
              sx={{ fontSize: { xs: 32, sm: 40 }, color: "#4b5563" }}
            />
          </div>
        )}
      </div>

      {/* Right Side: Username, Stats, Bio, Buttons */}
      <div className="flex-1 text-left min-w-0">
        {/* Username */}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
          {username}
        </h2>

        {/* Stats with right offset */}
        <div className="flex space-x-4 sm:space-x-8 mt-2 sm:mt-3 ml-2 sm:ml-6">
          <div className="text-left">
            <button
              className="text-base sm:text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
              onClick={handleOpenFollowers}
            >
              {followerCount}
            </button>
            <p className="text-xs sm:text-sm text-gray-600">Followers</p>
          </div>
          <div className="text-left">
            <button
              className="text-base sm:text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
              onClick={handleOpenFollowing}
            >
              {followingCount}
            </button>
            <p className="text-xs sm:text-sm text-gray-600">Following</p>
          </div>
        </div>

        {/* Bio */}
        <p className="text-gray-600 mt-2 sm:mt-3 text-sm sm:text-base line-clamp-3">
          {bio || <span className="italic">No bio yet</span>}
        </p>

        {/* Action Buttons */}
        <div className="mt-3 sm:mt-4">
          {isOwnProfile ? (
            <Button
              variant="outlined"
              color="primary"
              sx={{
                textTransform: "none",
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
              onClick={handleEditProfile}
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
              onClick={isFollowing ? handleUnfollow : handleFollow}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          )}
        </div>
      </div>

      {/* Modal for Followers/Following List */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="profile-list-modal"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 w-[90%] sm:w-[400px] max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              {modalType === "followers" ? "Followers" : "Following"}
            </h3>
            <button
              className="text-gray-600 hover:text-gray-900"
              onClick={handleCloseModal}
              aria-label="Close modal"
            >
              <CloseIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </button>
          </div>
          <ul className="space-y-3">
            {(modalType === "followers" ? followersList : followingList).map(
              (profile) => (
                <li key={profile.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <PersonIcon
                      sx={{ fontSize: { xs: 16, sm: 20 }, color: "#4b5563" }}
                    />
                  </div>
                  <span className="text-sm sm:text-base text-gray-900 truncate">
                    {profile.username}
                  </span>
                </li>
              ),
            )}
          </ul>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileHeader;
