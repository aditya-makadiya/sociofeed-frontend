import React, { useState, useEffect } from "react";
import { Button, Modal, CircularProgress } from "@mui/material";
import { Person as PersonIcon, Close as CloseIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

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
  const [modalType, setModalType] = useState(null); // 'followers' or 'following'
  // State for fetched list, loading, and error
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Navigation hook
  const navigate = useNavigate();

  // Base URL for API
  const API_BASE_URL = "http://localhost:5000";

  // Fetch followers or following when modal opens
  useEffect(() => {
    if (!modalOpen || !modalType) return;

    const fetchList = async () => {
      setLoading(true);
      setError(null);
      const endpoint = modalType === "followers" ? "followers" : "following";
      try {
        const response = await fetch(
          `${API_BASE_URL}/users/${id}/${endpoint}?page=1&pageSize=10`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status}: Failed to fetch ${modalType}`,
          );
        }
        const { status, data } = await response.json();
        if (status !== "success") {
          throw new Error("API response unsuccessful");
        }
        setListData(data.users);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [modalOpen, modalType, id]);

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
    setListData([]); // Clear list to avoid stale data
    setError(null);
  };

  // Handler for navigating to profile
  const handleProfileClick = (profileId) => {
    navigate(`/profile/${profileId}`);
    handleCloseModal(); // Close modal after navigation
  };

  // Placeholder handlers
  const handleFollow = () => {
    console.log(`Follow ${username}`);
    // TODO: Call /users/:id/follow
  };

  const handleUnfollow = () => {
    console.log(`Unfollow ${username}`);
    // TODO: Call /users/:id/unfollow
  };

  const handleEditProfile = () => {
    console.log("Edit profile clicked");
    // TODO: Implement edit modal
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
            >
              {isFollowing ? "Unfollow" : "Follow"}
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
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 w-[90%] sm:w-[400px] max-h-[80vh] overflow-y-auto">
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
          {loading ? (
            <div className="flex justify-center py-4">
              <CircularProgress size={24} />
            </div>
          ) : error ? (
            <p className="text-red-600 text-sm text-center">Error: {error}</p>
          ) : listData.length === 0 ? (
            <p className="text-gray-600 text-sm text-center">
              No {modalType === "followers" ? "followers" : "following"} yet
            </p>
          ) : (
            <ul className="space-y-3">
              {listData.map((profile) => (
                <li
                  key={profile.id}
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-md transition-colors"
                  onClick={() => handleProfileClick(profile.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleProfileClick(profile.id);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`View ${profile.username}'s profile`}
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt={`${profile.username}'s avatar`}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <PersonIcon
                        sx={{ fontSize: { xs: 16, sm: 20 }, color: "#4b5563" }}
                      />
                    )}
                  </div>
                  <span className="text-sm sm:text-base text-gray-900 truncate">
                    {profile.username}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ProfileHeader;
