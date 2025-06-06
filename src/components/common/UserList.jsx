// components/common/UserList.jsx
import React from "react";
import { CircularProgress, Button, Box, Typography } from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import useProfile from "../../hooks/useProfile";

const UserList = ({
  users = [],
  loading = false,
  error = null,
  emptyMessage = "No users found",
  onUserClick,
  onRetry,
  onRefetch,
  showRetryButton = true,
  className = "",
  itemClassName = "",
}) => {
  const { followUser, unfollowUser, followLoading } = useProfile();
  const navigate = useNavigate();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4} className={className}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={4} className={className}>
        <Typography color="error" variant="body2" mb={2}>
          Error: {error}
        </Typography>
        {showRetryButton && onRetry && (
          <Button variant="outlined" size="small" onClick={onRetry}>
            Retry
          </Button>
        )}
      </Box>
    );
  }

  if (users.length === 0) {
    return (
      <Box textAlign="center" py={4} className={className}>
        <Typography variant="body2" color="textSecondary">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  const handleFollow = async (userId) => {
    await followUser(userId);
    onRefetch();
  };

  const handleUnfollow = async (userId) => {
    await unfollowUser(userId);
    onRefetch();
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
    if (onUserClick) onUserClick(userId);
  };

  return (
    <ul className={`space-y-3 ${className}`}>
      {users.map((user) => (
        <li
          key={user.id}
          className={`flex items-center justify-between gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-md transition-colors ${itemClassName}`}
          onClick={() => handleUserClick(user.id)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleUserClick(user.id);
            }
          }}
          tabIndex={0}
          role="button"
          aria-label={`View ${user.username}'s profile`}
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${user.username}'s avatar`}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <PersonIcon
                  sx={{
                    fontSize: { xs: 16, sm: 20 },
                    color: "#4b5563",
                  }}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm sm:text-base text-gray-900 truncate block">
                {user.username}
              </span>
              {user.bio && (
                <span className="text-xs text-gray-500 truncate block">
                  {user.bio}
                </span>
              )}
            </div>
          </div>

          {user.isFollowing !== undefined && (
            <div className="flex-shrink-0">
              <Button
                variant={user.isFollowing ? "outlined" : "contained"}
                color="primary"
                size="small"
                sx={{
                  textTransform: "none",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  minWidth: "80px",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  user.isFollowing
                    ? handleUnfollow(user.id)
                    : handleFollow(user.id);
                }}
                disabled={followLoading}
              >
                {followLoading
                  ? "Loading..."
                  : user.isFollowing
                    ? "Unfollow"
                    : "Follow"}
              </Button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default UserList;
