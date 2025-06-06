// components/profile/ProfileHeader.jsx
import React, { useState, useEffect } from "react";
import { Button, Modal } from "@mui/material";
import { Person as PersonIcon, Close as CloseIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import useFollowersFollowing from "../../hooks/useFollowersFollowing";
import useProfile from "../../hooks/useProfile";
import UserList from "../common/UserList";
import CustomPagination from "../common/CustomPagination";
import EditProfileModal from "./EditProfileModal";

const ProfileHeader = ({ user, isOwnProfile }) => {
  const {
    id,
    username,
    bio,
    avatar,
    followerCount,
    followingCount,
    isFollowing,
  } = user;

  // State for modal visibility and type
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Use the custom hook with pageSize of 5
  const {
    data: listData,
    loading,
    error,
    pagination,
    fetchFollowers,
    fetchFollowing,
    clearData,
  } = useFollowersFollowing(5); // Set default page size to 5

  const { followUser, unfollowUser, followLoading, getUserProfile } =
    useProfile();

  const navigate = useNavigate();

  // Fetch data when modal opens
  useEffect(() => {
    if (!modalOpen || !modalType) return;

    if (modalType === "followers") {
      fetchFollowers(id, 1, 5); // Always start from page 1 when opening modal
    } else if (modalType === "following") {
      fetchFollowing(id, 1, 5); // Always start from page 1 when opening modal
    }
  }, [modalOpen, modalType, id, fetchFollowers, fetchFollowing]);

  // Handlers for opening modal
  const handleOpenFollowers = () => {
    setModalType("followers");
    clearData();
    setModalOpen(true);
  };

  const handleOpenFollowing = () => {
    setModalType("following");
    clearData();
    setModalOpen(true);
  };

  // Handler for closing modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setModalType(null);
    clearData();
  };

  // Handler for page change
  const handlePageChange = (event, newPage) => {
    if (modalType === "followers") {
      fetchFollowers(id, newPage, 5);
    } else if (modalType === "following") {
      fetchFollowing(id, newPage, 5);
    }
  };

  // Handler for navigating to profile
  const handleProfileClick = (profileId) => {
    navigate(`/profile/${profileId}`);
    handleCloseModal();
  };

  // Handler for retry
  const handleRetry = () => {
    if (modalType === "followers") {
      fetchFollowers(id, pagination.currentPage, 5);
    } else {
      fetchFollowing(id, pagination.currentPage, 5);
    }
  };

  // Handler for refetching after follow/unfollow
  const handleRefetchList = () => {
    if (modalType === "followers") {
      fetchFollowers(id, pagination.currentPage, 5);
    } else {
      fetchFollowing(id, pagination.currentPage, 5);
    }
  };

  // Follow and Unfollow handlers for the viewed profile
  const handleFollow = async () => {
    await followUser(id, true); // Pass isViewedProfile as true
  };

  const handleUnfollow = async () => {
    await unfollowUser(id, true); // Pass isViewedProfile as true
  };

  // Handler for opening edit profile modal
  const handleEditProfile = () => {
    setEditModalOpen(true);
  };

  // Handler for closing edit profile modal
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };

  // Handler for profile update callback
  const handleProfileUpdate = (updatedUser) => {
    console.log(updatedUser);

    getUserProfile(id);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 flex flex-row items-start gap-4 sm:gap-6 w-full">
      {/* Profile Picture */}
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

      {/* User Details */}
      <div className="flex-1 text-left min-w-0">
        {/* Username */}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
          {username}
        </h2>

        {/* Stats */}
        <div className="flex space-x-4 sm:space-x-8 mt-2 sm:mt-3 ml-2 sm:ml-6">
          <div className="text-left">
            <button
              className="text-base sm:text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
              onClick={handleOpenFollowers}
              aria-label={`View ${followerCount} followers`}
            >
              {followerCount}
            </button>
            <p className="text-xs sm:text-sm text-gray-600">Followers</p>
          </div>
          <div className="text-left">
            <button
              className="text-base sm:text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
              onClick={handleOpenFollowing}
              aria-label={`View ${followingCount} following`}
            >
              {followingCount}
            </button>
            <p className="text-xs sm:text-sm text-gray-600">Following</p>
          </div>
        </div>

        {/* Bio */}
        <p className="text-gray-600 mt-2 sm:mt-4 text-sm sm:text-sm line-clamp-2">
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
              disabled={followLoading}
            >
              {followLoading
                ? "Loading..."
                : isFollowing
                  ? "Unfollow"
                  : "Follow"}
            </Button>
          )}
        </div>
      </div>

      {/* Modal for Followers/Following */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="profile-list-modal"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(0, 0, 0, 0.55)",
        }}
      >
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 w-[90%] sm:w-[400px] max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              {modalType === "followers" ? "Followers" : "Following"}
              {pagination.totalCount > 0 && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({pagination.totalCount})
                </span>
              )}
            </h3>
            <button
              className="text-gray-600 hover:text-gray-900"
              onClick={handleCloseModal}
              aria-label="Close modal"
            >
              <CloseIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <UserList
              users={listData}
              loading={loading}
              error={error}
              emptyMessage={`No ${modalType === "followers" ? "followers" : "following"} yet`}
              onUserClick={handleProfileClick}
              onRetry={handleRetry}
              onRefetch={handleRefetchList} // Pass refetch method
            />
          </div>

          {/* Pagination */}
          <CustomPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalCount={pagination.totalCount}
            pageSize={pagination.pageSize}
            onPageChange={handlePageChange}
            showInfo={true}
            size="small"
            color="primary"
            className="mt-3"
          />
        </div>
      </Modal>

      {/* Edit Profile Modal */}
      {isOwnProfile && (
        <EditProfileModal
          open={editModalOpen}
          onClose={handleCloseEditModal}
          user={user}
          onProfileUpdate={handleProfileUpdate}
        />
      )}
    </div>
  );
};

export default ProfileHeader;
